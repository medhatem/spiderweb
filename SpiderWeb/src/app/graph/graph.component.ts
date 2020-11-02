import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Network, DataSet, Edge, Node } from "vis-network/standalone";
import { ApiService } from './../api.service';
import { Urls } from '../model/urls.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  public nodeId: String;
  public clickedNode;
  public options;
  public nodes;
  public edges;
  public nodesArray;
  public edgesArray;
  public container;
  public datas;
  public network;
  myUrls: Urls[];
  myFilteredNodes: Urls[];
  myFilteredEdges: Urls[];
  urlFilter: any = { id: '' };

  constructor(private spinner: NgxSpinnerService, private apiService: ApiService) {}
  
  ngOnInit() {
    // Chargement de 5sec avant l'affichage du graph
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    // Appel de la requete getAllGraph pour récupérer les données du Graph
    this.apiService.getAllGraph().subscribe((data: Urls[]) => {
      this.myUrls = data;
      console.log('getAllGraph ', this.myUrls);

      const noeud_edge = this.miseEnForme(this.myUrls);
      console.log('this.miseEnForme(this.myUrls)', this.miseEnForme(this.myUrls));

      this.nodes= noeud_edge.noeud;
      this.myFilteredNodes = this.nodes;
      console.log('this.nodes ', this.nodes);

      this.edges= noeud_edge.edges;
      this.myFilteredEdges = this.edges;
      console.log('this.edges ', this.edges);

      // Creer un array de noeuds
      this.nodesArray = new DataSet<Node, "id">(this.nodes);
      console.log("this.nodesArray ", this.nodesArray);

      // Creer un array de liens
      this.edgesArray = new DataSet<Edge, "id">(this.edges);
      console.log("this.edgesArray ", this.edgesArray);
    
      // create a network
      this.container = document.getElementById("mynetwork");
      this.datas = {
      nodes: this.nodesArray,
      edges: this.edgesArray
      };
      console.log("datas ", this.datas);

      // Ajouter les options du Graph
      this.options = {
        height: "700px",
        physics:{enabled:true}, //false si les noeuds ne se repositionnent pas automatiquement
        interaction:{navigationButtons: true}
      };

      console.log("ici");

      // Crée le Graph
      this.network = new Network(this.container, this.datas, this.options);
      console.log("this.network ", this.network);

      // Afficher le popup
     this.network.on("showPopup", function(node){});

      // Récuperer l'id du noeud au double click
     this.network.on('doubleClick', (properties) =>  {
       this.nodeId = properties.nodes[0];
       console.log('nodeIdd', this.nodeId);
       this.getId(this.nodeId);
     });

    });
    
 /*   
    // Creer un array de noeuds
    this.nodes = new DataSet<Node, "id">([
      { id: 1, label: "uSherbrooke", title: 'https://www.usherbrooke.ca/' }, //group:'myGroup'
      { id: 2, label: "Facebook", title: 'https://www.facebook.ca/' },
      { id: 3, label: "Github", title: 'https://www.github.ca/' },
      { id: 4, label: "Gitlab", title: 'https://www.gitlab.ca/' },
      { id: 5, label: "Amazon", title: 'https://www.amazon.ca/' }
    ]);
*/
    
  }
  
  // Appel de la requete GetAllGraph afin d'afficher un premier graph
  getId(id){
    this.apiService.getNodeChildren(id).subscribe((data) => {
    console.log("getNodeChildren(id) ", data);
    });
  }

  // sélectionne sur le Graph le noeud sélectionné dans la liste d'urls
  clickListNode(idUrl){
    this.network.selectNodes([idUrl]);
    console.log("clickList(id) " + idUrl);
  }

  clickListEdge(idUrl){
    this.network.selectEdges([idUrl]);
    console.log("clickList(id) " + idUrl);
  }

  
  //mise en forme pour viz
//retournne une liste de noeud et de edges
  miseEnForme(noeud_edge){
    var noeud= new Map();
    var edges= new Map();
 
    noeud_edge.edges.forEach( element => {
      noeud.set(element.url_parent, {id : element.url_parent, label : element.url_parent, title : element.url_parent});
      element.url_enfants.forEach(url => {
        noeud.set(url, {id : url, label : url, title : url});
        edges.set(element.url_parent + url, {from : element.url_parent, to: url});
       })
    });
    return {noeud : Array.from(noeud.values()),edges : Array.from(edges.values())};
  }

  openNoeudsLiens(item) {
    var i;
    var x = document.getElementsByClassName("noeudsLiens");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none"; 
    }
    document.getElementById(item).style.display = "block";
  }

}
