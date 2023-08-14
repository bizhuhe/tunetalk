import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { EditReviewComponent } from './edit-review.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
describe('EditReviewComponent', () => {
  let component: EditReviewComponent;
  let fixture: ComponentFixture<EditReviewComponent>;
  let httpClient: HttpClient;
  const mockReview = {
    id: 'mockId',
    user: 'mockUserId',
    userName: 'Mock User',
    song: 'mockSongId',
    songName: 'Mock Song',
    image: 'mock-image.png',
    rating: 1,
    comment: 'This is a mock review',
    createdAt: new Date()
  }
  const mockForm = {
    valid: true,
    value: {
      id:mockReview.id,
      rating: mockReview.rating,
      comment:mockReview.comment
    },
    resetForm: jasmine.createSpy('resetForm')
  };
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditReviewComponent],
      imports:[HttpClientTestingModule, FormsModule]
    });
    fixture = TestBed.createComponent(EditReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should submit the form and emit the event', ()=>{
    spyOn(httpClient, 'put').and.returnValue(of(''));
    spyOn(component.reviewSubmitted, 'emit');
    spyOn(component.collapseForm, 'emit');
    component.submitForm(mockForm as any);
    expect(mockForm.resetForm).toHaveBeenCalled();
    expect(component.reviewSubmitted.emit).toHaveBeenCalled();
    expect(component.collapseForm.emit).toHaveBeenCalled();

  })
});
