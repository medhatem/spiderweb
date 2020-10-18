const EventEmitter = require("events");

class CrawlEmitterClass extends EventEmitter {}

const CrawlEmitter = new CrawlEmitterClass();

const UrlsCaptured = [];

// https://riptutorial.com/node-js/example/20131/settimeout-promisified
function timer_ms(min_ms, max_ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, Math.random() * (max_ms - min_ms) + min_ms);
  });
}

const Create50Timer = async () => {
  await Promise.all(
    Array.from(Array(10000).keys()).map(async (index) => {
      await timer_ms(500, 1000); // Entre 0.5sec à 10sec
      CrawlEmitter.emit("catch", `url-${index}`);
    })
  );
};

CrawlEmitter.on("catch", (url) => {
  console.log(url);
  UrlsCaptured.push(url);
});

Create50Timer().then(() => {
  console.log("result: ", UrlsCaptured);
  console.log("count: ", UrlsCaptured.length);
});
