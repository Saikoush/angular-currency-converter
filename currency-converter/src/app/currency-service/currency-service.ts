import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private currencies: Currency[] = [];
  private lastUpdate: string = '';

  constructor(private http: HttpClient) {}

  getCurrencies() {
    return this.currencies;
  }

  getLastUpdate() {
    return this.lastUpdate;
  }

  getCurrenciesPromise() {
    return new Promise<any>((resolve, reject) => {

      if (this.currencies.length === 0) {

        this.http.get<any>('https://open.er-api.com/v6/latest/USD')
        .subscribe((data) => {

          for (let key in data.rates) {
            this.currencies.push({
              rate: data.rates[key],
              full_name: '',
              name: key,
              symbol: ''
            });
          }

          this.lastUpdate = data.time_last_update_utc;

          this.http.get<any>(
            'https://restcountries.com/v3.1/all?fields=currencies'
          ).subscribe((countryData) => {

            countryData.forEach((currency: any) => {

              if(currency.currencies){

                let name = Object.keys(currency.currencies)[0];

                let index = this.currencies.findIndex(
                  (e) => e.name === name
                );

                if(index !== -1){
                  this.currencies[index] = {
                    ...this.currencies[index],
                    full_name: currency.currencies[name].name,
                    symbol: currency.currencies[name].symbol
                  };
                }
              }
            });

            resolve(this.currencies);

          });

        });

      } else {
        resolve(this.currencies);
      }

    });
  }
}