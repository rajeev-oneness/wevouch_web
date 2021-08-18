import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcDetailsComponent } from './amc-details.component';

describe('AmcDetailsComponent', () => {
  let component: AmcDetailsComponent;
  let fixture: ComponentFixture<AmcDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmcDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmcDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
