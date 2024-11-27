import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpantryitemComponent } from './addpantryitem.component';

describe('AddpantryitemComponent', () => {
  let component: AddpantryitemComponent;
  let fixture: ComponentFixture<AddpantryitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddpantryitemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpantryitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
