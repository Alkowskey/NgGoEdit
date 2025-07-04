import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WsTestComponent } from './ws-test.component';

describe('WsTestComponent', () => {
  let component: WsTestComponent;
  let fixture: ComponentFixture<WsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WsTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
