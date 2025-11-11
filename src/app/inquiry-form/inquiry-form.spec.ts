import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryForm } from './inquiry-form';

describe('InquiryForm', () => {
  let component: InquiryForm;
  let fixture: ComponentFixture<InquiryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquiryForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InquiryForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
