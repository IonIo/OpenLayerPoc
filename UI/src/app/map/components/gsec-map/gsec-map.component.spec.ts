import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GsecMapComponent } from './gsec-map.component';

describe('GsecMapComponent', () => {
  let component: GsecMapComponent;
  let fixture: ComponentFixture<GsecMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GsecMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsecMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
