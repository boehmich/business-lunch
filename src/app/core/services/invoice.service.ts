import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Invoice} from '../models/invoice.model';
import {map} from "rxjs/operators";

const INVOICE_RESOURCE_URL = 'http://localhost:3000/api/invoice/';

@Injectable({providedIn: 'root'})

export class InvoiceService {
  private invoices: Invoice[] = [];
  private invoicesUpdated = new Subject<{ invoices: Invoice[] }>();

  constructor(private httpClient: HttpClient) {
  }

  public createInvoice(restaurant: string, date: string, amount: number, image: File): Promise<{ message: string, invoice: Invoice }> {
    const invoiceData = new FormData();
    invoiceData.append('restaurant', restaurant);
    invoiceData.append('date', date);
    invoiceData.append('amount', amount.toString());
    invoiceData.append('image', image, restaurant);
    return this.httpClient.post<{ message: string, invoice: Invoice }>(INVOICE_RESOURCE_URL, invoiceData).toPromise();
  }

  public retrieveInvoice(id: string) {
    return this.httpClient.get<{ _id: string, restaurant: string, date: string, amount: number, imagePath: string }>(INVOICE_RESOURCE_URL + id).toPromise();
  }

  public retrieveAllInvoices() {
    this.httpClient.get<{ message: string, invoices: any }>(INVOICE_RESOURCE_URL)
      .pipe(map((invoiceData) => {
        return {invoices: invoiceData.invoices.map((invoice: { _id: string; restaurant: string; date: string; amount: number; imagePath: string; }) => {
          return {
            id: invoice._id,
            restaurant: invoice.restaurant,
            date: invoice.date,
            amount: invoice.amount,
            imagePath: invoice.imagePath,
            creator: null,
          };
        })};
      }))
      .subscribe(result => {
        //console.log(result);
        this.invoices = result.invoices;
        this.invoicesUpdated.next({
          invoices: [...result.invoices]
        });
      })
  }

  public updateInvoice(id: string, restaurant: string, date: string, amount: number, image: File | string) {
    let invoiceData: FormData | Invoice;
    if(typeof(image) === 'object'){
      invoiceData = new FormData();
      invoiceData.append('id', id);
      invoiceData.append('restaurant', restaurant);
      invoiceData.append('date', date);
      invoiceData.append('amount', amount.toString());
      invoiceData.append('image', image, restaurant);
    } else {
      invoiceData = {id: id, restaurant: restaurant, date: date, amount: amount, imagePath: image, creator: null};
    }
    return this.httpClient.put(INVOICE_RESOURCE_URL + id, invoiceData).toPromise();
  }

  public deleteInvoice(id: string): Promise<{message: string}> {
    return this.httpClient.delete<{message: string}>(INVOICE_RESOURCE_URL + id).toPromise();
  }

  getInvoiceUpdateListener() {
    return this.invoicesUpdated.asObservable();
  }
}
