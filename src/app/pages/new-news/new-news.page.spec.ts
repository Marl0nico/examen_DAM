import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewNewsPage } from './new-news.page';

describe('NewNewsPage', () => {
  let component: NewNewsPage;
  let fixture: ComponentFixture<NewNewsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
