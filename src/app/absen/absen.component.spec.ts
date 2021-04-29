import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenComponent } from './absen.component';

describe('AbsenComponent', () => {
  let component: AbsenComponent;
  let fixture: ComponentFixture<AbsenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
