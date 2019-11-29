import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoPostrePage } from './juego-postre.page';

describe('JuegoPostrePage', () => {
  let component: JuegoPostrePage;
  let fixture: ComponentFixture<JuegoPostrePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoPostrePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoPostrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
