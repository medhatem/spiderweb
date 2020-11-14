const GetUrlsGraphCollection = require("../conn-databases/mongodb").GetUrlsGraphCollection;
const GetUrlsFeastCollection = require("../conn-databases/mongodb").GetUrlsFeastCollection;
const allTokensOfActiveCrawlers = require("../services/crawlers-manager").allTokensOfActiveCrawlers;
const Double = require("mongodb").Double;
const crypto = require("crypto");

/**
 * Va chercher tout les edges et tout les noeuds de la bd
 */
const fetchAllUrlsGraph = async () => {
  const noeud_edges = await GetUrlsGraphCollection()
    .find({})
    .project({ _id: 0, url_parent: 1, url_enfants: 1 })
    .toArray();
  return { edges: noeud_edges };
};

/**
 * Pour un noeud/url specifie en parametre, va chercher un certaine profondeur de edges
 * @param {*} urlparent L'url initial
 * @param {*} maxDepth Nombre maximum de niveau de descendants qui va etre explore
 */
const fetchOneNodeUrlsGraph = async (urlparent, maxDepth = 3) => {
  const noeud_edges = await GetUrlsGraphCollection()
    .aggregate([
      { $match: { url_parent: urlparent } },
      {
        $graphLookup: {
          from: "urls_graph",
          startWith: "$url_parent",
          connectFromField: "url_enfants",
          connectToField: "url_parent",
          maxDepth,
          depthField: "numConnections",
          as: "edges",
        },
      },
      {
        $project: {
          _id: 0,
          url_parent: 1,
          url_enfants: 1,
          "edges.url_parent": 1,
          "edges.url_enfants": 1,
          "edges.numConnections": 1,
        },
      },
    ])
    .toArray();

  return { edges: noeud_edges[0] ? noeud_edges[0].edges : [] };
};

/**
 * Creation d'un objet pour le bulk update de la collection feast pour quand un url a ete pris.
 * @param {*} crawler_token
 * @param {*} url
 */
const createAfterFeastUpdateObject = (crawler_token, url) => {
  return {
    updateOne: { filter: { url }, update: { $set: { taken: true, taken_date: new Date(), taken_by: crawler_token } } },
  };
};

/**
 * Les tokens qui viennent d'etre collecte sont marques comme pris par le crawler courant
 * @param {*} crawler_token
 * @param {*} urls
 */
const markTaken = async (crawler_token, urls) => {
  if (!(urls && urls.length > 0)) {
    return false;
  }

  urls_update_array = urls.map((url) => createAfterFeastUpdateObject(crawler_token, url));
  const result = await GetUrlsFeastCollection().bulkWrite(urls_update_array);
  return result;
};

/**
 * Retourne un certain nombre d'url au crawler qui a demander. Il peut mentionner un maximum d'url s'il veut.
 * @param {*} crawler_session
 * @param {*} max_urls_count
 */
const feast = async (crawler_session, max_urls_count) => {
  const all_token = await allTokensOfActiveCrawlers();

  // Trouve l'index du token du crawler courant dans la liste de tokens
  const crawler_current_index = all_token
    .map(({ crawler_token }, index) => ({
      crawler_token,
      index,
    }))
    .filter(({ crawler_token }) => crawler_token === crawler_session.crawler_token)[0].index;

  // Le nombre de token fetch
  const token_count = all_token.length;

  // Trouve des urls non consommé pour le crawler courant.
  // Prend en compte le nombre de crawler actif actuel pour
  // les mettre en famine.
  const urls_not_consumed = (
    await GetUrlsFeastCollection()
      .find(
        {
          $and: [
            { taken: { $eq: false } },
            { distribution_number: { $mod: [token_count, crawler_current_index] } }, // distribution_number % token_count === crawler_current_index
          ],
        },
        { projection: { url: 1, _id: 0 } }
      )
      .limit(max_urls_count)
      .toArray()
  ).map(({ url }) => url);

  await markTaken(crawler_session.crawler_token, urls_not_consumed);

  return urls_not_consumed;
};

/**
 * Hashage d'un url a un nombre pour lui appliquer un modulo plus tard
 * @param {*} url
 */
const urlToNumber = (url) => {
  hash = crypto.createHash("sha1");
  hash.update(url);
  const url_hashed = hash.digest("hex");
  // Mongodb peut faire des modulo seulement sur des long (int64) alors on stock pas en double
  const url_hashed_slice = url_hashed.slice(url_hashed.length - 13);
  return Number(`0x${url_hashed_slice}`);
};

/**
 * Verifier que les urls (clef primaire) sont distincts
 * @param {*} distinct_urls Une liste d'url distinct
 * @param {*} collection La collection ou verifier
 * @param {*} prop_name La propriete dans la collection qui represente la cle primaire
 */
const verify_urls_are_distincts = async (distinct_urls, collection, prop_name) => {
  const urls_to_not_insert_obj = await collection
    .find({ [prop_name]: { $in: distinct_urls } })
    .project({ [prop_name]: 1, _id: 0 })
    .toArray();
  const urls_to_not_insert = urls_to_not_insert_obj.map((obj) => obj[prop_name]);
  const urls_to_save = distinct_urls.filter((url) => urls_to_not_insert.indexOf(url) < 0);
  return urls_to_save;
};

/**
 * Stocker les urls dans la collection feast
 * @param {*} distinct_urls Une liste d'url distinct
 */
const stock_to_feast_urls = async (distinct_urls) => {
  const urls_to_save = await verify_urls_are_distincts(distinct_urls, GetUrlsFeastCollection(), "url");

  if (urls_to_save.length === 0) {
    return false;
  }

  const result = await GetUrlsFeastCollection().insertMany(
    urls_to_save.map(
      (url) => ({
        url,
        distribution_number: Double(urlToNumber(url)),
        taken: false,
        taken_date: null,
        taken_by: null,
        creation_time: new Date(),
        doc_version: 1,
      }),
      { ordered: false }
    )
  );

  return result;
};

/**
 * On stock les informations extraient de plusieurs sites dans les collections graph et feast
 * @param {*} crawler_session La session du crawler avec c'est information de connexion
 * @param {*} sites Les urls extraient de plusieurs sites
 */
const stock = async (crawler_session, sites) => {
  const feast_set_url_enfants = new Set();
  const promise_array = [];

  // On retire les sites envoyer par le crawler dont le url principal est present en double
  unique_sites = Array.from(
    sites
      .reduce((acc, cur) => {
        acc.set(cur.lien_principal, cur);
        return acc;
      }, new Map())
      .values()
  );

  // On verifie dans la bd que les urls principals ne sont pas deja present et on retourne ceux qu'ils n'y étaient pas.
  const urls_to_save = await verify_urls_are_distincts(
    unique_sites.map(({ lien_principal }) => lien_principal),
    GetUrlsGraphCollection(),
    "url_parent"
  );

  // On retire les sites dont les urls principals sont deja dans bd
  sites_to_save = unique_sites.filter(({ lien_principal }) => urls_to_save.indexOf(lien_principal) > -1);

  //On cree les requetes pour sauvegarder les urls des sites dans la bd pour le graph et feast
  sites_to_save.forEach((site) => {
    url_enfants = Array.from(new Set(site.set_enfant));

    const ops_insert_to_graph_promise = GetUrlsGraphCollection().insertOne({
      url_parent: site.lien_principal,
      url_enfants,
      creation_time: new Date(),
      crawler_token: crawler_session.crawler_token, // Crawler who has found the urls
      doc_version: 1,
    });

    promise_array.push(ops_insert_to_graph_promise);
    url_enfants.forEach((url) => feast_set_url_enfants.add(url));
  });
  promise_array.push(stock_to_feast_urls([...feast_set_url_enfants]));

  // On execute les requetes
  const results = await Promise.all(promise_array);
  return results;
};

/**
 * On stock les urls initiaux envoye par le client
 * @param {*} urls Les urls initiaux a stocker
 */
const init_stock = async (urls) => {
  const urls_to_stock = Array.from(new Set(urls));
  const result = await stock_to_feast_urls(urls_to_stock);
  return result;
};

module.exports = { fetchAllUrlsGraph, fetchOneNodeUrlsGraph, feast, stock, init_stock };
