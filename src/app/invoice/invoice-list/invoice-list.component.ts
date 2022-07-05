import {Component, OnDestroy, OnInit} from "@angular/core";
import {InvoiceService} from "../../core/services/invoice.service";
import {Invoice} from "../../core/models/invoice.model";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../core/services/authentication.service";

@Component({
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit, OnDestroy{
  public invoices: Invoice[] = [];
  public isLoading: boolean = false;
  public imagePath: string = '';
  public userIsAdmin = false;

  private invoiceSubscription!: Subscription;
  private userIsAdminListenerSubscription!: Subscription;

  constructor(private invoiceService: InvoiceService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.invoiceService.retrieveAllInvoices();
    this.isLoading = true;
    this.invoiceSubscription = this.invoiceService.getInvoiceUpdateListener()
      .subscribe((invoiceData: {invoices: Invoice[]}) => {
        this.isLoading = false;
        this.invoices = invoiceData.invoices;
      });
    this.userIsAdmin = this.authenticationService.getUserIsAdmin();
    this.userIsAdminListenerSubscription = this.authenticationService.getIsAdminStatusListener()
      .subscribe(isAdmin => {
        this.userIsAdmin = isAdmin;
      });
  }

  ngOnDestroy() {
    this.invoiceSubscription.unsubscribe();
    this.userIsAdminListenerSubscription.unsubscribe();
  }

  showInvoiceImage(imagePath: string) {
    this.imagePath = imagePath;
  }

  deleteInvoice(id: string) {
    this.isLoading = true;
    this.invoiceService.deleteInvoice(id)
      .then(result => {
        console.log(result);
        this.invoiceService.retrieveAllInvoices();
      })
      .catch(error => {
        console.log(error);
      });
  }
}
