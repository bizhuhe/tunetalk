import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { SearchComponent } from "./search.component";
import { SearchService } from "./search.service";
import { SpotifyApiService } from "../spotify.api.service";
import { Router } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SearchResultService } from "../search-result/search-result.service";
import { of, throwError } from "rxjs";
describe("SearchComponent", () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockSearchResultService: SearchResultService;
  let mockSearchService: SearchService;
  let mockSpotifyApiService: any;
  let mockRouter: any;

  mockSearchResultService = jasmine.createSpyObj("SearchResultService", [
    "updateSearchResults",
    "saveSearchResultsToLocalStorage",
    "clearSearchResults",
  ]);
  // mockSearchService = jasmine.createSpyObj("SearchService", []);
  mockSpotifyApiService = {
    albumIdArray: [],
    apiUrl: "https://api.spotify.com/v1",
    spotifyClientId: "7df113924c854f52ab04b38533cac6ab",
    spotifyClientSecret: "056998e226d2453aaac1441a2f1c212e",

    searchSongs: jasmine
      .createSpy("searchSongs")
      .and.returnValue(of({ tracks: { items: [] } })),
    mapTrackInfo: jasmine.createSpy("mapTrackInfo").and.returnValue({}),
  };

  mockRouter = {
    navigate: jasmine.createSpy("navigate"),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: SearchResultService, useValue: mockSearchResultService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: SpotifyApiService, useValue: mockSpotifyApiService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    mockSearchResultService = TestBed.inject(SearchResultService);
    mockSearchService = TestBed.inject(SearchService);
    mockSpotifyApiService = TestBed.inject(SpotifyApiService);
    mockRouter = TestBed.inject(Router); 
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should search and process tracks when a query exists", async () => {
    component.query = "test";
    const mockItems = [{}, {}, {}]; // fill this with your actual expected items structure
    const mappedItems = mockItems.map(mockSpotifyApiService.mapTrackInfo);
    mockSpotifyApiService.mapTrackInfo.calls.reset();
    if (component && typeof component.processTracks === 'function') {
      spyOn(component, "processTracks").and.callThrough();
    }
    
    spyOn(component.http, "get").and.returnValue(of({ tracks: { items: mockItems } }));
  
    await component.search();
  
    expect(component.http.get).toHaveBeenCalledWith(`http://localhost:3000/spotify/search/${encodeURIComponent(component.query)}`);
    expect(mockSpotifyApiService.mapTrackInfo).toHaveBeenCalledTimes(mockItems.length);
    expect(component.processTracks).toHaveBeenCalledWith(mappedItems);
    expect(mockSearchResultService.updateSearchResults).toHaveBeenCalledWith(mappedItems);
    expect(mockSearchResultService.saveSearchResultsToLocalStorage).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/searchResult']);
  });
  it('should call the clearSearchResults method of the search result service', () => {
    component.clearSearchResults();
    expect(mockSearchResultService.clearSearchResults).toHaveBeenCalled();
  });
  it("should clear search results when the query is empty", async () => {
    component.query = "";
    await component.search();
    expect(mockSearchResultService.clearSearchResults).toHaveBeenCalled();
  });
  


  // using done because here it's calling an async method
  it("should handle the error when searching", async () => {
    const errorResponse = new Error("An error occurred");
    component.query = "test";
    spyOn(console, "error");
    spyOn(component.http, "get").and.returnValue(throwError(errorResponse));
  
    await component.search();
  
    expect(console.error).toHaveBeenCalledWith("Error searching music:", errorResponse);
  });
  it("shouldn't move key up if a random key other then enter is pressed", () => {
    const event = new KeyboardEvent("keyup", {
      key: "Space",
    });

    spyOn(component, "search");
    component.onKeyUp(event);
    expect(component.search).not.toHaveBeenCalled();
  });
  it("should move key up if a enter is pressed", () => {
    const event = new KeyboardEvent("keyup", {
      key: "Enter",
    });

    spyOn(component, "search");
    component.onKeyUp(event);
    expect(component.search).toHaveBeenCalled();
  });
});
