import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should set item in local storage if in browser', () => {
      const key = 'testKey';
      const value = { some: 'value' };

      spyOn(localStorage, 'setItem');
      service.setItem(key, value);

      expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should not throw an error if localStorage throws an error', () => {
      const key = 'testKey';
      const value = { some: 'value' };

      spyOn(localStorage, 'setItem').and.callFake(() => { throw new Error('LocalStorage error'); });
      spyOn(console, 'error');

      expect(() => service.setItem(key, value)).not.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error saving to localStorage', jasmine.any(Error));
    });

  
  });

  describe('getItem', () => {
    it('should get item from local storage if in browser', () => {
      const key = 'testKey';
      const value = { some: 'value' };

      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(value));
      const result = service.getItem(key);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it('should return null if item not found', () => {
      const key = 'nonExistentKey';

      spyOn(localStorage, 'getItem').and.returnValue(null);
      const result = service.getItem(key);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });

    it('should handle JSON parsing errors gracefully', () => {
      const key = 'testKey';

      spyOn(localStorage, 'getItem').and.returnValue('{ invalidJson: }');
      spyOn(console, 'error');

      const result = service.getItem(key);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error reading from localStorage', jasmine.any(SyntaxError));
    });

  
  });
});