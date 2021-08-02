///<reference types = "cypress"/>
import{format, prepareLocalStorage} from '../support/utils'
//cy.viewport
// arquivos de config
// configs por linha de comando

context('Dev Finanças - Agilizei', () => {
    //hooks
    //trechos que executam antes e depois do testee
    // before -> antes de todos os testes
    // beforeEach - > antes de cada teste
    //after -> depois de todos os testes
    //afterEach -> depois de cada teste

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app')

        onbeforeunload: (win) => {
          prepareLocalStorage(win)
        }
       // cy.get('#data-table tbody tr').should('have.length', 0) - removendo após aula
        
    });

    it('Cadastrando Entradas', () => {
        
        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type('Presente') // id
        cy.get('[name=amount]').type(12) // atributos
        cy.get('[type=date]').type('2021-03-21')  // atributos
        cy.get('button').contains('Salvar').click() // tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 1)
        // validr dados cadastrados
    });

    it('Cadastrar Saidas', () => {
        
        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type('Passagem') // id
        cy.get('[name=amount]').type(-5) // atributos
        cy.get('[type=date]').type('2021-03-22')  // atributos
        cy.get('button').contains('Salvar').click() // tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 1)
        // validr dados cadastrados
    });
    // Cadastrar saidas

    it('Remover entradas e saidas', () => {
        
        // estratégia 1 : voltar para elemento pai e avançar para um td img attr

        cy.get('td.description')
          .contains("Mesada")
          .parent()
          .find('img[onclick*=remove]')
          .click()

          // estratégia 2: buscar todos os irmãos e buscar o que tem img + attr
          cy.get('td.description')
            .contains("Suco Kapo")
            .siblings()
            .children('img[onclick*=remove]')
            .click()

        cy.get('#data-table tbody tr').should('have.length', 2)

    });

    it('Validar saldo com diversas transações', () => {
        // capturar as linas com as transações
        // capturar o texto entre as colunas
        // formatar esses valores das linhas
        
        // somar os valores de entradas e saidas
        // capturar o texto do total
        // comparar o somatoria de entradas e comparar com o total

            let incomes = 0
            let expenses = 0

        cy.get('#data-table tbody tr')
          .each(($el, index, $list) => {
            
            cy.log($el).find('td.income, td.expense').invoque('text').then(text => {
              if(text.includes('-')){
                expenses = expenses + format(text)
              } else {
                incomes = incomes + format(text)
              }  
              cy.log('Entradas', incomes)
              cy.log('Saídas', expenses)
            })    
          })

        cy.get('#totalDisplay').invoke('text').then(text => {
            cy.log('valor total', format(text))
            let formattedTotalDisplay = format(text)
            let expectedTotal = income + expenses

            expected(formattedTotalDisplay).to.eq(expectedTotal)
        })
        
    });
});