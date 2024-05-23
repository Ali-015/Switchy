import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutInputComponent } from './short-cut-input.component';
import { FormsModule } from '@angular/forms';

describe('ShortCutInputComponent', () => {
  let component: ShortcutInputComponent;
  let fixture: ComponentFixture<ShortcutInputComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortcutInputComponent, FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShortcutInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutInputComponent);
    component = fixture.componentInstance;
    inputElement = fixture.nativeElement.querySelector('input');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty value', () => {
    expect(component.value).toEqual('');
  });

  it('should update value and placeholder on key press', () => {
    component.writeValue('a');
    const event = new KeyboardEvent('keydown', { key: 'a' });
    inputElement.dispatchEvent(event);
    expect(component.value).toEqual('a');
    expect(component.placeholder).toEqual('a');
  });

  it('should not update value and placeholder on key press if value is valid', () => {
    component.writeValue('Control+Shift+a');
    const event = new KeyboardEvent('keydown', { key: 'b' });
    inputElement.dispatchEvent(event);
    expect(component.value).toEqual('Control+Shift+a');
    expect(component.placeholder).toEqual('Control+Shift+a');
  });

  it('should not clear value on blur if value is valid', () => {
    component.writeValue('Control+Shift+a');
    inputElement.blur();
    expect(component.value).toEqual('Control+Shift+a');
  });

  it('should not clear value on keyup if value is invalid and previous state is valid', () => {
    component.writeValue('Control+Shift+a');
    inputElement.focus();
    inputElement.value = 'Invalid';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    expect(component.value).toEqual('Control+Shift+a');
  });

  it('should not clear value on keyup if value is valid', () => {
    component.writeValue('Control+Shift+a');
    inputElement.focus();
    inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    expect(component.value).toEqual('Control+Shift+a');
  });

  it('should set disabled class when value is empty', () => {
    expect(inputElement.classList.contains('disabled')).toBeTruthy();
  });
});
