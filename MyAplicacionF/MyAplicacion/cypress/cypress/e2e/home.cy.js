describe('Pruebas E2E con Ionic y JSON-Server', () => {
  it('Carga la página principal de Ionic', () => {
    cy.viewport(412, 915);
    cy.visit('http://localhost:8100/');
  });

  it('Realiza login exitoso y navega al home', () => {
    cy.viewport(412, 915);
    cy.visit('http://localhost:8100/login');
    
    // Interactuar con el campo de Email
    cy.get('ion-input[label="Email"] input', { timeout: 30000 })
      .should('exist')
      .type('cha.makito@duocuc.cl', { force: true });

    // Interactuar con el campo de Contraseña
    cy.get('ion-input[label="Contraseña"] input', { timeout: 30000 })
      .should('exist')
      .type('qweasdzxc');

    // Clic en el botón "Ingresar"
    cy.get('ion-button.ionBu', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Verifica que la URL cambie correctamente al home
    cy.url().should('include', '/home');

    // Forzar el clic en el botón "Cerrar" a pesar de estar cubierto
    cy.get('#botonCerrar', { timeout: 20000 })
      .should('be.visible') 
      .click({ force: true }); 

      cy.get('ion-input[label="Email"] input', { timeout: 30000 })
      .should('exist')
      .type('tapia@conductorduoc.cl', { force: true });

    // Interactuar con el campo de Contraseña
    cy.get('ion-input[label="Contraseña"] input', { timeout: 30000 })
      .should('exist')
      .type('qweasdzxc');      

    // Clic en el botón "Ingresar"
    cy.get('ion-button.ionBu', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#botonCerrar', { timeout: 80000 })
      .should('be.visible') 
      .click({ force: true });

    cy.get('ion-input[label="Contraseña"] input', { timeout: 30000 })
      .should('exist')  // Asegúrate de que el campo existe
      .clear()          // Limpia el contenido del campo

    cy.get('a', { timeout: 80000 })
      .should('be.visible')
      .click();

    cy.get('#recup input')
      .type('cha.makito@duocuc.cl');
    
    cy.get('#recuperacion', { timeout: 80000 })
      .should('be.visible')
      .click();

    cy.get('#goback', { timeout: 80000 })
      .should('be.visible')
      .click();
  });
});
