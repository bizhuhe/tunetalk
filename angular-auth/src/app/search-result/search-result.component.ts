import { Component, Input } from '@angular/core';
import { SearchResultService } from './search-result.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {
  @Input() albumTile:any;
  storedResults: any[] = [];

  constructor( public searchResultService: SearchResultService) {}

  ngOnInit() {
    this.retrieveStoredResults();
  }
  retrieveStoredResults() {
    const storedResults = localStorage.getItem('searchResults');
    if (storedResults) {
      this.storedResults = JSON.parse(storedResults);
    }
  } 
}