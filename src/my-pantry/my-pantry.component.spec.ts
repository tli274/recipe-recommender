import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPantryComponent } from './my-pantry.component';

describe('MyPantryComponent', () => {
  let component: MyPantryComponent;
  let fixture: ComponentFixture<MyPantryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPantryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPantryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
