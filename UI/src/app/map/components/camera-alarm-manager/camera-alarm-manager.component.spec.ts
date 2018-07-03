import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraAlarmManagerComponent } from './camera-alarm-manager.component';

describe('CameraAlarmManagerComponent', () => {
  let component: CameraAlarmManagerComponent;
  let fixture: ComponentFixture<CameraAlarmManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraAlarmManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraAlarmManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
