import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Network, DataSet, Edge, Node } from "vis-network/standalone";
import { ApiService } from './../api.service';
import { Graph } from '../model/graph.model';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  public nodeId: String;
  public clickedNode;
  myGraph: Graph[];
  urlFilter: any = { label: '' };

  constructor(private spinner: NgxSpinnerService, private apiService: ApiService) {}
  
  ngOnInit() {
    //Chargement de 5sec avant l'affichage du graph
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    // create an array with nodes
    var nodes = new DataSet<Node, "id">([
      { id: 1, label: "uSherbrooke", title: 'https://www.usherbrooke.ca/', },
      { id: 2, label: "Facebook", title: 'https://www.facebook.ca/' },
      { id: 3, label: "Github", title: 'https://www.github.ca/' },
      { id: 4, label: "Gitlab", title: 'https://www.gitlab.ca/' },
      { id: 5, label: "Amazon", title: 'https://www.amazon.ca/' }
    ]);

    this.myGraph = [
      {
          id: '1',
          label: 'uSherbrooke'
      },
      {
          id: '2',
          label: 'Facebook'
      },
      {
          id: '3',
          label: 'Github'
      },
      {
          id: '4',
          label: 'Gitlab'
      },
      {
          id: '5',
          label: 'Amazon'
      }
  ];

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

    // add network options
    var options = {
      height: "700px",
      physics:{enabled:true} //false si les noeuds ne se repositionnent pas automatiquement
    };

    var network = new Network(container, data, options);

    // display popup
    network.on("showPopup", function(node){});

    // get node id on doubleclick
    network.on('doubleClick', (properties) =>  {
      this.nodeId = properties.nodes[0];
      console.log('nodeId', this.nodeId);
      this.getId(this.nodeId);
    });

  }
  
  // Appel de la requete GetAllGraph afin d'afficher un premier graph
  getId(id){
    this.apiService.getNodeChildren(id).subscribe((data) => {
    console.log("getNodeChildren(id) " + data);
    });
  }

  clickList(id){
    console.log("clickList(id) " + id);
    
  }


    
}
