import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumTileComponent } from './album-tile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlbumDataService } from 'src/app/album-data.service';
import { Router } from '@angular/router';

describe('AlbumTileComponent', () => {
  let component: AlbumTileComponent;
  let fixture: ComponentFixture<AlbumTileComponent>;
  let mockAlbumDataService: Partial<AlbumDataService>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockAlbumDataService = {
      setAlbum: jasmine.createSpy('setAlbum'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      declarations: [AlbumTileComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AlbumDataService, useValue: mockAlbumDataService },
        { provide: Router, useValue: mockRouter },
      ],
    });
    fixture = TestBed.createComponent(AlbumTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setAlbum and navigate when openAlbumTile is called', () => {
    const mockAlbumTile = {
      id: '12345',
    };
    component.albumTile = mockAlbumTile;
    component.openAlbumTile();
    expect(mockAlbumDataService.setAlbum).toHaveBeenCalledWith(mockAlbumTile);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/album-details', mockAlbumTile.id],
      { state: mockAlbumTile }
    );
  });
});
