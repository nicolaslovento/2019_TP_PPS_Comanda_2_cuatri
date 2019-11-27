import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPage } from './alta.page';

describe('AltaPage', () => {
  let component: AltaPage;
  let fixture: ComponentFixture<AltaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
