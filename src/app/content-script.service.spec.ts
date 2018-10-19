import { TestBed, inject } from '@angular/core/testing';

import { ContentScriptService } from './content-script.service';

describe('ContentScriptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentScriptService]
    });
  });

  it('should be created', inject([ContentScriptService], (service: ContentScriptService) => {
    expect(service).toBeTruthy();
  }));
});
