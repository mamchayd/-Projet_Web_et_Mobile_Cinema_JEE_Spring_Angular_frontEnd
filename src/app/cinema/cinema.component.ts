import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
}) 
export class CinemaComponent implements OnInit {

  public villes; public cinemas;
  public currentVille;
  public currentCinema;
  public currentProjection :any;
  public selectedTickets;
 
  public salles:any;

  constructor(public cinemaService:CinemaService) { }

  ngOnInit() {
    this.cinemaService.getVilles()
    .subscribe(data=>{
      this.villes=data;
    },err=>{
      console.log(err);
    })
  }

  onGetCinemas(v){
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
    .subscribe(data=>{
      this.cinemas=data;
    },err=>{
      console.log(err);
    })
  }

  onGetSalles(c){
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
    .subscribe(data=>{
      this.salles=data;
      this.salles._embedded.salles.forEach(salle => {
        this.cinemaService.getProjections(salle)
        .subscribe(data=>{
          salle.projections=data;
        },err=>{
          console.log(err);
        })
      });
    },err=>{
      console.log(err);
    })
  }

  getImageName(film){
    let imageName=film.titre.replace(/[\\*-]/g,"");
    return imageName+".jpg";
  }
  onGetTicketsPlaces(p){
    this.currentProjection=p;
    console.log(p);
    this.cinemaService.getTicketsPlaces(p)
    .subscribe(data=>{
     this.currentProjection.tickets=data;
     this.selectedTickets=[];
    },err=>{
      console.log(err);
    })
  }

  onSelectTicket(t){
    if(!t.selected){
      t.selected=true;
      this.selectedTickets.push(t);
    }
    else{
      t.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
    console.log(this.selectedTickets);
  
  }
  getTicketClass(t){
    let str="btn ticket ";
    if(t.reserve==true){
      str+="btn-danger";
    }
    else if(t.selected){
      str+="btn-warning "
    }
    else{
      str+="btn-success";
    }
    return str;
  }

  onPayTickets(dataForm){
    let tickets=[];
    this.selectedTickets.forEach(t=> {
      tickets.push(t.id);
    });
    dataForm.tickets=tickets;
   this.cinemaService.payerTickets(dataForm)
   .subscribe(data=>{
   alert("Tickets Reserver avec succes!");
   this.onGetTicketsPlaces(this.currentProjection);
   },err=>{
     console.log(err);
   })

  }

}
