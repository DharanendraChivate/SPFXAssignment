import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ProductFilterWebPart.module.scss';
import * as strings from 'ProductFilterWebPartStrings';
import 'jquery';
require('bootstrap');
//import * as bs from 'bootstrap';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { SPComponentLoader } from '@microsoft/sp-loader';
export interface IProductFilterWebPartProps {
  description: string;
}

export default class ProductFilterWebPart extends BaseClientSideWebPart<IProductFilterWebPartProps> {


/*
 <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
*/

  public render(): void {
    let cssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(cssURL);
    this.domElement.innerHTML = `    
      <div class="${ styles.productFilter }">
        <div class="${ styles.container }">
          <div class="${ styles.row }" style="background-color:#131212;">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Filter Products!</span>
              <div class="col-md-12">
                <select class="form-control" id="categoryDD" style="background-color:#00ffff;">
                 
                </select>
                <br><br>
                <table class="table table-bordered table-dark" id="productId">
                  <thead>
                    <tr>
                      <th scope="col">Product Name</th>
                    </tr>
                  </thead>
                  <tbody id="productIdBody">
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>`;
      this.ReadyFun();
      this.LoadEventListner();
      this.ChangeEventListner();

     // this.LoadPage();
      
  }
  ReadyFun(){
    alert("readyfun called");
    $(document).ready(function(){
      var issuccess = 0;
      var call = jQuery.ajax({
        url: this.context.pageContext.web.absoluteUrl + "/_api/Web/Lists/getByTitle('Categoryname')/Items?$select=Category,ID",
        type: "GET",
        dataType: "json",
        headers: {
            Accept: "application/json; odata=verbose",
            "Content-Type": "application/json;odata=verbose"
        }
    });
    call.done(function (data, textStatus, jqXHR) {
        $("#categoryDD option").remove();
        var message = jQuery("#categoryDD");
  
        jQuery.each(data.d.results, function (index, value) {
            message.append($("<option></option>")
                .attr("value", value.ID)
                .text(value.Category));
        });
       issuccess = 1;
        ///FilterProductsData();
    });
    call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Unable to get data... Error: " + message);
    });
    alert("ready ra :"+issuccess);
      if(issuccess == 1)
      {
        alert("first time scs ready ");
        this.ChangeRequest();
      }
      else
      {
        alert("first time fail ready");
      }

    });
  }

  LoadEventListner()
  {
    /*******************Without Jquery and ajax **********************/
    /*let html: string = '';
    this.context.spHttpClient.get(
      this.context.pageContext.web.absoluteUrl+`/_api/Web/Lists/getByTitle('Categoryname')/Items?$select=Category,ID`,
      SPHttpClient.configurations.v1
    )
    .then((response: SPHttpClientResponse) => {
      response.json().then((listsObjects: any) => {
        listsObjects.value.forEach(listObject => {
          html += `
                          <option value="${listObject.ID}">${listObject.Category}</option>
                  `;
        });
        this.domElement.querySelector('#categoryDD').innerHTML = html;
      });
    });
    alert("for first");*/
     /*******************Without Jquery and ajax **********************/


    
    /***************With Jquery and ajax***************************/
    var issuccess = 0;
    var call = jQuery.ajax({
      url: this.context.pageContext.web.absoluteUrl + "/_api/Web/Lists/getByTitle('Categoryname')/Items?$select=Category,ID",
      type: "GET",
      dataType: "json",
      headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json;odata=verbose"
      }
  });
  call.done(function (data, textStatus, jqXHR) {
      $("#categoryDD option").remove();
      var message = jQuery("#categoryDD");

      jQuery.each(data.d.results, function (index, value) {
          message.append($("<option></option>")
              .attr("value", value.ID)
              .text(value.Category));
      });
     issuccess = 1;
      ///FilterProductsData();
  });
  call.fail(function (jqXHR, textStatus, errorThrown) {
      var response = JSON.parse(jqXHR.responseText);
      var message = response ? response.error.message.value : textStatus;
      alert("Unable to get data... Error: " + message);
  });
  alert("sadsdad"+issuccess);
    if(issuccess == 1)
    {
      alert("first time scs");
      this.ChangeRequest();
    }
    else
    {
      alert("first time fail");
    }
  }

  ChangeEventListner()
  {
    this.domElement.querySelector('#categoryDD').addEventListener('change',()=>this.ChangeRequest());
  }

  ChangeRequest()
  {
    alert("ChangeRequest");
    var selectedCategoryId = $('#categoryDD').val();
    alert("data :"+selectedCategoryId);
/***********************Without Jquery and ajax******************************/
  /*  let html: string = '';
        this.context.spHttpClient.get(
          this.context.pageContext.web.absoluteUrl+`/_api/Web/Lists/getByTitle('Products')/Items?$select=Title&$filter=(Category eq ${selectedCategoryId})`,  //&$filter=(Catagory eq ${selectedCategoryId})
          SPHttpClient.configurations.v1
        )
        .then((response: SPHttpClientResponse) => {
          response.json().then((listsObjects: any) => {
            listsObjects.value.forEach(listObject => {
              html += `<tr>
                        <td>${listObject.Title}</td>
                      </tr>
                      `;
            });
            this.domElement.querySelector('#productIdBody').innerHTML = html;
          });
        });
*/
/***********************Without Jquery and ajax******************************/
      var table = null;
      var call = jQuery.ajax({
          url: this.context.pageContext.web.absoluteUrl + "/_api/Web/Lists/getByTitle('Products')/Items?$select=Title&$filter=(Category eq "+$('#categoryDD').val()+")",
          type: "GET",
          dataType: "json",
          headers: {
              Accept: "application/json; odata=verbose",
              "Content-Type": "application/json;odata=verbose"
          }
      });
      call.done(function (data, textStatus, jqXHR) {

          $("#productId tbody tr").remove();
          table = $("#productId tbody");
          $.each(data.d.results, function (idx, elem) {
              table.append("<tr><td>" + elem.Title + "</td></tr>");
          });
      });
      call.fail(function (jqXHR, textStatus, errorThrown) {
          var response = JSON.parse(jqXHR.responseText);
          var message = response ? response.error.message.value : textStatus;
          alert("Call hutch failed. Error: " + message);
      });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  // LoadPage()
  // {
  //   var selectedCategoryId;
  //   // A $( document ).ready() block.
  //   $( document ).ready(function() {
  //     alert("ready function");
  //     selectedCategoryId = $('#categoryDD').val();
  //     alert("data :"+selectedCategoryId);

      

  //   });
  //   alert("data aaaaaa: "+selectedCategoryId);
  //   let html: string = '';
  //     this.context.spHttpClient.get(
  //       this.context.pageContext.web.absoluteUrl+`/_api/Web/Lists/getByTitle('Products')/Items?$select=Title&$filter=(Category eq ${$('#categoryDD').val()})`,  //&$filter=(Catagory eq ${selectedCategoryId})
  //       SPHttpClient.configurations.v1
  //     )
  //     .then((response: SPHttpClientResponse) => {
  //       response.json().then((listsObjects: any) => {
  //         listsObjects.value.forEach(listObject => {
  //           html += `<tr>
  //                     <td>${listObject.Title}</td>
  //                   </tr>
  //                   `;
  //         });
  //         this.domElement.querySelector('#productIdBody').innerHTML = html;
  //       });
  //     });
  // }
}
