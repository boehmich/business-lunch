import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { mimeType } from '../../core/services/mime-type-validator.service';
import {InvoiceService} from "../../core/services/invoice.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Invoice} from "../../core/models/invoice.model";

@Component({
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css']
})
export class InvoiceCreateComponent implements OnInit{
  public minDate: Date;
  public maxDate: Date;
  public form!: FormGroup;
  public isLoading = false;
  public invoice!: Invoice | null;
  public imagePreview!: string;
  private mode = 'create';
  private invoiceId!: string;


  constructor(private invoiceService: InvoiceService,
              private router: Router,
              private route: ActivatedRoute) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit() {
    this.form = new FormGroup({
      'restaurant': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'amount': new FormControl(null, {
        validators: [Validators.required]
      }),
      'date': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap) => {
      if(paramMap.get('invoiceId')) {
        this.mode = 'edit';
        this.invoiceId = paramMap.get('invoiceId')!;
        this.isLoading = true;
        this.invoiceService.retrieveInvoice(this.invoiceId)
          .then(invoiceData => {
            this.isLoading = false;
            this.invoice = {
              id: invoiceData._id,
              restaurant: invoiceData.restaurant,
              amount: invoiceData.amount,
              date: invoiceData.date,
              imagePath: invoiceData.imagePath,
              creator: ''};
            this.form.setValue({'restaurant': this.invoice.restaurant, 'amount': this.invoice.amount, 'date': this.invoice.date, 'image': this.invoice.imagePath});
            this.imagePreview = this.invoice.imagePath;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.mode = 'create';
        this.invoice = null;
      }
    });
  }

  saveInvoice() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const isoStringDate = this.convertDateToISOString(this.form.value.date);

    if(this.mode === 'create'){
      this.invoiceService.createInvoice(this.form.value.restaurant, isoStringDate, this.form.value.amount, this.form.value.image)
        .then(res => {
          console.log(res);
          this.router.navigate(['/list']);
        });
    } else {
      this.invoiceService.updateInvoice(this.invoiceId, this.form.value.restaurant, isoStringDate, this.form.value.amount, this.form.value.image)
        .then(result => {
          console.log(result);
          this.router.navigate(['/list']);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files!.item(0);

    if (!file) {
      return;
    }

    this.form.patchValue({image: file});
    this.form.get('image')!.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file as Blob);
  }

  convertDateToISOString(date: any): string{
    if(typeof(date) === 'string') {
      return date;
    }
    return date.toISOString();
  }
}
