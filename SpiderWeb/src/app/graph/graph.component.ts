import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Network, DataSet, Edge, Node } from "vis-network/standalone";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) {}
 
  ngOnInit() {
    //Chargement de 5sec avant l'affichage du graph
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);


    var nodes = new DataSet<Node, "id">([
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
      { id: 4, label: "Node 4" },
      { id: 5, label: "Node 5" }
    ]);
    
    // create an array with edges
    var edges = new DataSet<Edge, "id">([
      { id: 1, from: 1, to: 3 },
      { id: 2, from: 1, to: 2 },
      { id: 3, from: 2, to: 4 },
      { id: 4, from: 2, to: 5 },
      { id: 5, from: 3, to: 3 }
    ]);
    
    // create a network
    var container = document.getElementById("mynetwork");
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      height: '700px'
    };
    
    var network = new Network(container, data, options);


  }
}
