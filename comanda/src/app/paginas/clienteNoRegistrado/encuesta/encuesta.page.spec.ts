import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaPage } from './encuesta.page';

describe('EncuestaPage', () => {
  let component: EncuestaPage;
  let fixture: ComponentFixture<EncuestaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
