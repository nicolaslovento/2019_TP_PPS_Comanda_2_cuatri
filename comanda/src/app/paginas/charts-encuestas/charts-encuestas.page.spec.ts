import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsEncuestasPage } from './charts-encuestas.page';

describe('ChartsEncuestasPage', () => {
  let component: ChartsEncuestasPage;
  let fixture: ComponentFixture<ChartsEncuestasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsEncuestasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsEncuestasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
