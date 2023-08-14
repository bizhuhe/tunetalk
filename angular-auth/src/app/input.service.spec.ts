import { NgForm } from "@angular/forms";
import { InputService } from "./input.service";

describe("InputService", () => {
  let service: InputService;
  let mockComponent: any;
  let mockInput: any;
  let mockForm: NgForm;

  beforeEach(() => {
    service = new InputService();
    mockComponent = {
      input: {},
      inputBeingEdited: undefined,
      editing: false,
      review: {},
      reviewBeingEdited: undefined,
    };
    mockInput = { someField: 'value' };
    mockForm = { resetForm: jasmine.createSpy() } as any;
  });

  it('should set the component state for editing input', () => {
    service.editInput(mockComponent, mockInput);

    expect(mockComponent.input).toEqual({ ...mockInput });
    expect(mockComponent.inputBeingEdited).toEqual(mockInput);
    expect(mockComponent.editing).toBe(true);
  });

  it('should reset the component state and the form', () => {
    service.resetForm(mockComponent, mockForm);

    expect(mockComponent.review).toEqual({});
    expect(mockComponent.editing).toBe(false);
    expect(mockComponent.reviewBeingEdited).toBeUndefined();
  });
});
