import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonEditFormComponent } from './polygon-edit-form.component';

describe('PolygonEditFormComponent', () => {
  let component: PolygonEditFormComponent;
  let fixture: ComponentFixture<PolygonEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
