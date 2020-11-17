import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Network, DataSet, Edge, Node } from "vis-network/standalone";
import { ApiService } from './../api.service';
import { Urls } from '../model/urls.model';
import { ToastrService } from 'ngx-toastr';

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
  public nodesChildren;
  public edgesChildren;
  public nodesArray;
  public edgesArray;
  public container;
  public datas;
  public network;
  public i;
  myUrls: Urls[];
  myFilteredNodes: Urls[];
  myFilteredEdges: Urls[];
  urlFilter: any = { id: '' };

  constructor(private spinner: NgxSpinnerService, private apiService: ApiService, private toastr: ToastrService) {}
  
  ngOnInit() {

    // Chargement de 5sec avant l'affichage du graph
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000); //2000 pour PROD

    // Appel de la requete getAllGraph pour récupérer les données du Graph
    this.apiService.getAllGraph().subscribe((data: Urls[]) => {
      this.myUrls = data;
      console.log('getAllGraph ', this.myUrls);

      const noeud_edge = this.miseEnForme(this.myUrls);
      console.log('this.miseEnForme(this.myUrls)', this.miseEnForme(this.myUrls));

      this.nodes= noeud_edge.noeud;
      const nodes_arr: any[] = Array.from(this.nodes.values());
      this.myFilteredNodes = nodes_arr
      console.log('this.nodes ', nodes_arr);

      this.edges= noeud_edge.edges;
      const edges_arr: any[] = Array.from(this.edges.values());
      this.myFilteredEdges = edges_arr
      console.log('this.edges ',  edges_arr);

      // Creer un array de noeuds
      this.nodesArray = new DataSet<Node, "id">(nodes_arr);
      console.log("this.nodesArray ", this.nodesArray);

      // Creer un array de liens
      this.edgesArray = new DataSet<Edge, "id">(edges_arr);
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
        physics: {
          stabilization: false,
          barnesHut:{
            gravitationalConstant: -80000,
            springConstant: 0.001,
            springLength: 200
          },
        },
        interaction:{
          navigationButtons: true,
          hideEdgesOnDrag: true,
          hideEdgesOnZoom: true
        },
        nodes:{
          shape: "dot",
          size: 20,
          font: {
            size: 20,
            face: "Tahoma",
          },
        },
        edges: {
          width: 0.15,
          color:{ 
            inherit: 'from',  
          },
          smooth: {
            type: "continuous",
          },
        },
        layout:{
          improvedLayout: false,
        },
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
    
  }
  
  // Appel de la requete GetAllGraph afin d'afficher un premier graph
  getId(id){
    this.apiService.getNodeChildren(id).subscribe((data: Urls[]) => {
      this.myUrls = data;
      console.log('getNodeChildren ', this.myUrls);

      const noeud_edge = this.miseEnForme(this.myUrls);
      console.log('getNodeChildren this.miseEnForme(this.myUrls)', this.miseEnForme(this.myUrls));

      this.nodesChildren= Array.from(noeud_edge.noeud.values());
      //this.myFilteredNodes = this.nodes;
      console.log('getNodeChildren this.nodes ', this.nodesChildren);

      this.edgesChildren= Array.from(noeud_edge.edges.values());
      //this.myFilteredEdges = this.edges;
      console.log('getNodeChildren this.edges ', this.edgesChildren);

      this.addNode(this.nodesChildren, this.edgesChildren);
      console.log("addNode ", this.nodesChildren, this.edgesChildren);
    });
    
  }

  addNode(nodes, edges) { 

    this.i = 0;

    nodes.forEach( new_node => {
      if(!this.nodes.has(new_node.id)){
        console.log("La valeur n'existe pas!");
        this.nodesArray.add(new_node);
        this.nodes.set(new_node.id, new_node);
        this.i++;
      }
    });

    edges.forEach(new_edge => {
      const edge_id = new_edge.from + new_edge.to;
      if(!this.edges.has(edge_id)){
        this.edgesArray.add(new_edge);
        this.edges.set(edge_id, new_edge);
        this.i++;
      }
    });

    this.Message();
  }
  

  Message = async () => {

      //await this.addNode(this.nodesChildren, this.edgesChildren);
    
      if(this.i > 0){
  
        this.toastr.success(this.i + " noeuds/liens ont été trouvés", 'Succès');
        console.log("i sucess:", this.i);
      }
      if(this.i == 0){
        
        this.toastr.warning("Aucun nouveau noeud/lien n'a été trouvé. Réessayez plus tard ", '' + this.nodeId + '');
        console.log("i warning:", this.i);
      }
      console.log("i :", this.i);
  }



  // sélectionne sur le Graph le noeud sélectionné dans la liste d'urls
  clickListNode(idUrl){
    this.network.selectNodes([idUrl]);
    this.focusOnNode(idUrl);
    console.log("clickList(id) " + idUrl);
  }

  /*
  // sélectionne sur le Graph le lien sélectionné dans la liste de liens
  clickListEdge(idUrl){
    this.network.selectEdges([idUrl]);
    console.log("clickList(id) " + idUrl);
  }
  */

  //mise en forme pour viz
  //retournne une liste de noeud et de edges
  miseEnForme(noeud_edge){
    var noeud= new Map();
    var edges= new Map();
 
    noeud_edge.edges.forEach( element => {
      noeud.set(element.url_parent, {id : element.url_parent, label : element.url_parent, title : element.url_parent});
      element.url_enfants.forEach(url => {
        noeud.set(url, {id : url, label : url, title : url, group : this.randomInteger(1, 10)});
        edges.set(element.url_parent + url, {from : element.url_parent, to: url});
       })
    });
    return { noeud, edges };
  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  focusOnNode(id) {
    var nodeId = id;
    var options = {
      scale: 1.0,
      offset: { x: 0, y: 0 },
      animation: {
        duration: 1000,
        easingFunction: "easeInOutQuad",
      },
    };
    this.network.focus(nodeId, options);
  }

  /*
  openNoeudsLiens(item) {
    var i;
    var x = document.getElementsByClassName("noeudsLiens");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none"; 
    }
    document.getElementById(item).style.display = "block";
  }*/


}
