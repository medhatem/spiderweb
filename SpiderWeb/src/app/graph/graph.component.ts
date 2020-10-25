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
  public options;
  public nodes;
  public network;
  myGraph: Graph[];
  urlFilter: any = { label: '' };

  constructor(private spinner: NgxSpinnerService, private apiService: ApiService) {}
  
  ngOnInit() {
    // Chargement de 5sec avant l'affichage du graph
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    // Appel de la requete getAllGraph pour récupérer les données du Graph
    /*
    this.apiService.getAllGraph().subscribe((data: Graph[]) => {
      this.myGraph = data;
    });*/

    // Creer un array de noeuds
    this.nodes = new DataSet<Node, "id">([
      { id: 1, label: "uSherbrooke", title: 'https://www.usherbrooke.ca/' }, //group:'myGroup'
      { id: 2, label: "Facebook", title: 'https://www.facebook.ca/' },
      { id: 3, label: "Github", title: 'https://www.github.ca/' },
      { id: 4, label: "Gitlab", title: 'https://www.gitlab.ca/' },
      { id: 5, label: "Amazon", title: 'https://www.amazon.ca/' }
    ]);

    // initialiser l'array Graph[]
    this.myGraph = [
      {
          id: '1',
          label: 'uSherbrooke',
          title: 'https://www.usherbrooke.ca/'
      },
      {
          id: '2',
          label: 'Facebook',
          title: 'https://www.facebook.ca/'
      },
      {
          id: '3',
          label: 'Github',
          title: 'https://www.github.ca/'
      },
      {
          id: '4',
          label: 'Gitlab',
          title: 'https://www.gitlab.ca/'
      },
      {
          id: '5',
          label: 'Amazon',
          title: 'https://www.amazon.ca/'
      }
  ];

    // Creer un array de liens
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
      nodes: this.nodes,
      edges: edges
    };

    // Ajouter les options du Graph
    this.options = {
      height: "700px",
      physics:{enabled:true} //false si les noeuds ne se repositionnent pas automatiquement
    };

    // Crée le Graph
    this.network = new Network(container, data, this.options);

    // Afficher le popup
    this.network.on("showPopup", function(node){});

    // Récuperer l'id du noeud au double click
    this.network.on('doubleClick', (properties) =>  {
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

  // sélectionne sur le Graph le noeud sélectionné dans la liste d'urls
  clickList(idUrl){
    this.network.selectNodes([idUrl]);
    console.log("clickList(id) " + idUrl);
  }
  


    
}
