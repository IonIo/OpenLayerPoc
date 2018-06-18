import { AngularMaterialExportModule } from './angular-material-export.module';

describe('AngularMaterialExportModule', () => {
  let angularMaterialExportModule: AngularMaterialExportModule;

  beforeEach(() => {
    angularMaterialExportModule = new AngularMaterialExportModule();
  });

  it('should create an instance', () => {
    expect(angularMaterialExportModule).toBeTruthy();
  });
});
