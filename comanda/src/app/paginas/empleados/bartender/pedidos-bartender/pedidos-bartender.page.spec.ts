import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosBartenderPage } from './pedidos-bartender.page';

describe('PedidosBartenderPage', () => {
  let component: PedidosBartenderPage;
  let fixture: ComponentFixture<PedidosBartenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosBartenderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosBartenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
