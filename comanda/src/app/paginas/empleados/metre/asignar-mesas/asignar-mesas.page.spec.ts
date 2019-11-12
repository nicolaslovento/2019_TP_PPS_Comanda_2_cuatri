import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarMesasPage } from './asignar-mesas.page';

describe('AsignarMesasPage', () => {
  let component: AsignarMesasPage;
  let fixture: ComponentFixture<AsignarMesasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarMesasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarMesasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
