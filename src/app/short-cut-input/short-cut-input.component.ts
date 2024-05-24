import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'shortcut-input',
  standalone: true,
  templateUrl: './short-cut-input.component.html',
  imports:[FormsModule, CommonModule],
  styleUrls: ['./short-cut-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShortcutInputComponent),
      multi: true,
    },
  ],
})
export class ShortcutInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() modifiers: string[] = [];
  @Input() placeholder: string = 'Press Shortcut';
  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef<HTMLInputElement>;

  value: string = '';
  focused: boolean = false;
  onTouched: () => void = () => {};
  onChange: (value: string) => void = () => {};
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.setupListeners();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: string): void {
    this.value = value;
    this.updatePlaceholder(value ? value : 'Press Shortcut');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputElement.nativeElement.classList.add('disabled');
    } else {
      this.inputElement.nativeElement.classList.remove('disabled');
    }
  }

  @HostListener('focus')
  onFocus() {
    this.focused = true;
  }

  @HostListener('blur')
  onBlur() {
    this.focused = false;
    if (!this.isValidShortcut(this.value)) {
      this.value = '';
      this.updatePlaceholder('Press Shortcut');
    }
    this.onTouched();
  }

  private setupListeners() {
    const keydown$ = fromEvent<KeyboardEvent>(window, 'keydown');
    const keyup$ = fromEvent<KeyboardEvent>(window, 'keyup');
    const input$ = fromEvent<InputEvent>(this.inputElement.nativeElement, 'input');

    keydown$
      .pipe(
        tap((event) => event.preventDefault()),
        filter(() => this.focused),
        map((event) => this.mapEventToShortcut(event)),
        filter((shortcut) => this.isValidShortcut(shortcut)),
        takeUntil(this.destroy$)
      )
      .subscribe((shortcut) => {
        this.value = shortcut;
        this.updatePlaceholder(shortcut);
        this.onChange(this.value);
      });

    merge(
      keydown$.pipe(filter(() => this.focused)),
      keyup$.pipe(filter(() => this.focused)),
      input$.pipe(map((event) => (event.target as HTMLInputElement).value))
    )
      .pipe(
        tap((event) => {
          if (this.focused) {
            const shortcut =
              event instanceof KeyboardEvent
                ? this.mapEventToShortcut(event)
                : event;
            this.updatePlaceholder(shortcut);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    keyup$
      .pipe(
        filter(() => this.focused && !this.isValidShortcut(this.value)),
        tap(() => {
          this.value = '';
          this.updatePlaceholder('Press Shortcut');
          this.onChange(this.value);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private mapEventToShortcut(event: KeyboardEvent): string {
    const keys = [];
    if (event.ctrlKey) keys.push('Control');
    if (event.altKey) keys.push('Alt');
    if (event.shiftKey) keys.push('Shift');
    if (event.metaKey) keys.push('Meta');
    if (!this.modifiers.includes(event.key)) keys.push(event.key);
    return keys.join(' ');
  }

  private isValidShortcut(shortcut: string): boolean {
    const parts = shortcut.split(' ');
    const modifierKeys = parts.filter((key) => this.modifiers.includes(key));
    const nonModifierKeys = parts.filter(
      (key) => !this.modifiers.includes(key)
    );
    return modifierKeys.length > 0 && nonModifierKeys.length === 1;
  }

  private updatePlaceholder(placeholder: string) {
    this.placeholder = placeholder;
  }
}
