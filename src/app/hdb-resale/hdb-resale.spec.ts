import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdbResale } from './hdb-resale';

describe('HdbResale', () => {
  let component: HdbResale;
  let fixture: ComponentFixture<HdbResale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HdbResale],
    }).compileComponents();

    fixture = TestBed.createComponent(HdbResale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
