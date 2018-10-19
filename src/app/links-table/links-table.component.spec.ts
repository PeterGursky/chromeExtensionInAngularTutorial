
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksTableComponent } from './links-table.component';

describe('LinksTableComponent', () => {
  let component: LinksTableComponent;
  let fixture: ComponentFixture<LinksTableComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinksTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
