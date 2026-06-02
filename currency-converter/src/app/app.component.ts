import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CurrencyService } from './currency-service/currency-service.service';
import { Currency } from './currency';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  currencies: Currency[] = [];

  fromCurrency!: Currency;
  toCurrency!: Currency;

  amount = 1;
  result = 0;

  constructor(private currencyService: CurrencyService){}

  ngOnInit(): void {

    this.currencyService.getCurrenciesPromise()
    .then((data: Currency[]) => {

      this.currencies = data;

      this.fromCurrency = data[0];
      this.toCurrency = data[1];
    });
  }

  convertCurrency(){

    const rate =
      this.toCurrency.rate / this.fromCurrency.rate;

    this.result = this.amount * rate;
  }

  switchCurrencies(){

    let temp = this.fromCurrency;

    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;

    this.convertCurrency();
  }
}