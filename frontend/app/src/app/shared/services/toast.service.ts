import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

    constructor(
        private messageService : MessageService
    ){
    }
    toast(severity:string="success", summary:string="", detail:string="") {
        this.messageService.add({key:'toast', severity: severity, summary: summary, detail: detail, });
    }
}
