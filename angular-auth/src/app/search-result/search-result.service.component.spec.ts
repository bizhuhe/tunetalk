import { TestBed } from "@angular/core/testing";
import { SearchResultService } from "./search-result.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("SearchResultService", () => {
  let service: SearchResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchResultService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SearchResultService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should update and get search results correctly", () => {
    const mockResults = [
      {
        id: "1",
        name: "Album Name",
        artists: ["some singer"],
        image: "Album Image",
        popularity: 89,
        release: new Date(),
        reviews: [],
      },
      {
        id: "2",
        name: "Album Name2",
        artists: ["some singer2"],
        image: "Album Image2",
        popularity: 32,
        release: new Date(),
        reviews: [],
      },
    ];

    expect(service.searchResults.length).toBe(0);
    service.updateSearchResults(mockResults);
    expect(service.searchResults).toEqual(mockResults);

    const searchResults$ = service.getSearchResults();
    searchResults$.subscribe((results) => {
      // convert the 'release' property of each result to a Date object
      results.forEach((result) => {
        result.release = new Date(result.release);
      });

      expect(results).toEqual(mockResults);
    });
    service.clearSearchResults();
    expect(service.searchResults.length).toBe(0);
  });
  it("should return empty array when no search results available", () => {
    // Mock localStorage methods
    spyOn(localStorage, "getItem").and.callFake(
      (key: string): string | null => {
        switch (key) {
          case "searchResults":
            return null; // No search results
          default:
            return null;
        }
      }
    );

    const searchResults$ = service.getSearchResults();
    searchResults$.subscribe((results) => {
      expect(results).toEqual([]);
    });
  });

  it("should update unique songs correctly", () => {
    const mockUniqueSongs = [
      { id: 1, name: "Song 1" },
      { id: 2, name: "Song 2" },
    ];
    expect(service.uniqueSongs.length).toBe(0);

    service.updateUniqueSongs(mockUniqueSongs);
    expect(service.uniqueSongs).toEqual(mockUniqueSongs);
  });

  it("should save search results to localStorage correctly", () => {
    const mockResults = [
      { id: 1, name: "Song 1" },
      { id: 2, name: "Song 2" },
    ];

    expect(service.searchResults.length).toBe(0);
    service.updateSearchResults(mockResults);

    // After updating, the searchResults array should contain the mockResults
    expect(service.searchResults).toEqual(mockResults);
    service.saveSearchResultsToLocalStorage();
  });
});
