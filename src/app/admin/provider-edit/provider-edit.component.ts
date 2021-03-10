import { CatalogueItem } from './../models/provider-catalogue';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { skip, startWith, switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Provider } from '../models/provider';
import { ItemStatus } from '../models/provider-catalogue';
import { ProvidersService } from '../services/providers.service';

@Component({
  selector: 'app-provider-edit',
  templateUrl: './provider-edit.component.html',
  styleUrls: ['./provider-edit.component.scss'],
})
export class ProviderEditComponent implements OnInit {
  data$: Observable<Provider>;
  data: Provider;
  selectedId: number;
  
  formGroup: FormGroup;
  nameFormControl: FormControl;

  catalogItems: FormArray;

  get nameErrors() {
    return !!this.nameFormControl.errors
      ? Object.keys(this.nameFormControl.errors)
      : [];
  }

  constructor(
    private providerSvc: ProvidersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  initData() {
    this.data$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = Number(params.get('id'));
        return this.providerSvc.getProvider(this.selectedId);
      }),
      tap(provider => {this.fillForm(provider);
      this.data = provider;})
    );
  }

  initForm() {
    this.nameFormControl = new FormControl('',
      { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(150)],
      updateOn: 'blur'}
    );

    this.catalogItems = new FormArray([]);

    this.formGroup = this.formBuilder.group({
      id: new FormControl(),
      name: this.nameFormControl,
      description: new FormControl(),
      location: new FormControl(),
      catalogue: new FormGroup({
        id: new FormControl(),
        description: new FormControl(),
        items: this.catalogItems,
      }),
    });
  }

  fillForm(data: Provider) {
    this.formGroup.get('id').setValue(data.id);
    this.formGroup.get('name').setValue(data.name);
    this.formGroup.get('description').setValue(data.description);
    this.formGroup.get('location').setValue(data.location);
    this.formGroup
      .get('catalogue.description')
      .setValue(data.catalogue.description);
    this.formGroup.get('catalogue.id').setValue(data.catalogue.id);
    data.catalogue?.items?.forEach((item) => {
      const name = new FormControl(item.name, {updateOn: 'blur'});
      const price = new FormControl(item.price, {updateOn: 'blur'});
      const status = new FormControl(ItemStatus.Initial);

      combineLatest([name.valueChanges.pipe(startWith('')), price.valueChanges.pipe(startWith(''))]).pipe(skip(1)).subscribe(([n,p]) => {status.setValue(ItemStatus.Updated); console.log('updated')});
      (this.formGroup.get('catalogue.items') as FormArray).push(
        new FormGroup({
          id: new FormControl(item.id),
          name,
          price,
          status
        })
      );

    });
  }

  save() {
    if (this.formGroup.valid) {
      const form = this.formGroup.value;
      console.log('new name: ', form);
      
      this.providerSvc.updateProvider(form.id, form).subscribe(() => {
        this.initForm();
        this.initData();
      });
    } else {
      this.getFormValidationErrors();
    }
  }

  addNewMenuItem(){
    this.catalogItems.push(this.formBuilder.group({
      name: new FormControl(),
      price: new FormControl(),
      status: new FormControl(ItemStatus.Added)
    }));
  }

  deleteMenuItem(control : AbstractControl) {
    const itemStatus = control.get('status');

    if(itemStatus.value !== ItemStatus.Added)
      itemStatus.setValue(ItemStatus.Deleted);
      else
      this.catalogItems.removeAt(this.catalogItems.controls.findIndex(c => c == control));
  }

  filteredItems(){
    return this.catalogItems.controls.filter(c => c.get('status').value != ItemStatus.Deleted);
  }

  getFormValidationErrors() {
    Object.keys(this.formGroup.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.formGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            'Key control: ' + key + ', keyError: ' + keyError + ', err value: ',
            controlErrors[keyError]
          );
        });
      }
    });
  }
}


