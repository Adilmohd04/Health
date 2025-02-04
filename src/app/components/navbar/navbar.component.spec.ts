import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { Renderer2, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let renderer: Renderer2;
  let el: ElementRef;
  
  beforeEach(async () => {
    const rendererMock = {
      listen: jasmine.createSpy('listen'),
      setStyle: jasmine.createSpy('setStyle'),
      removeClass: jasmine.createSpy('removeClass'),
      addClass: jasmine.createSpy('addClass')
    };

    const elementRefMock = {
      nativeElement: {
        querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([]),
        querySelector: jasmine.createSpy('querySelector').and.returnValue(null),
      }
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: Renderer2, useValue: rendererMock },
        { provide: ElementRef, useValue: elementRefMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    renderer = TestBed.inject(Renderer2);
    el = TestBed.inject(ElementRef);

    fixture.detectChanges(); // Ensure the component is initialized
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSelectComponent when a menu item is clicked', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('.menu-item'));
    const menuItem = menuItems[0].nativeElement;
    spyOn(component, 'onSelectComponent');

    // Simulate a click event
    menuItem.click();

    expect(component.onSelectComponent).toHaveBeenCalledWith('form');
  });

  it('should update the active menu item when clicked', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('.menu-item'));
    const firstMenuItem = menuItems[0].nativeElement;
    const secondMenuItem = menuItems[1].nativeElement;
    const wee = fixture.debugElement.query(By.css('.wee')).nativeElement;

    // Initial state: The first item should be active
    firstMenuItem.click();
    fixture.detectChanges();
    expect(firstMenuItem.classList).toContain('current-menu-item');
    expect(wee.style.left).toBe(`${firstMenuItem.offsetLeft}px`);

    // Simulate clicking the second item
    secondMenuItem.click();
    fixture.detectChanges();
    expect(secondMenuItem.classList).toContain('current-menu-item');
    expect(wee.style.left).toBe(`${secondMenuItem.offsetLeft}px`);
  });


  it('should call resetWeePosition when mouse leaves', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('.menu-item'));
    const firstMenuItem = menuItems[0].nativeElement;

    spyOn<any>(component, 'resetWeePosition'); // Spy on private method

    // Simulate mouseleave event
    firstMenuItem.dispatchEvent(new MouseEvent('mouseleave'));

    expect(component['resetWeePosition']).toHaveBeenCalled();
  });

  it('should emit componentSelected when menu item is clicked', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('.menu-item'));
    const menuItem = menuItems[0].nativeElement;
    spyOn(component.componentSelected, 'emit');

    menuItem.click();

    expect(component.componentSelected.emit).toHaveBeenCalledWith('form');
  });
});
