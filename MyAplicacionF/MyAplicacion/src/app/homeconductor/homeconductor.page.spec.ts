import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeconductorPage } from './homeconductor.page';

describe('HomeconductorPage', () => {
  let component: HomeconductorPage;
  let fixture: ComponentFixture<HomeconductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeconductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
