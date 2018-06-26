
  import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDashboardComponent } from './map-dashboard.component';

describe('MapDashboardComponent', () => {
  let component: MapDashboardComponent;
  let fixture: ComponentFixture<MapDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
