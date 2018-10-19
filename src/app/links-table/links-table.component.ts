import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { LinksTableDataSource } from './links-table-datasource';
import { ContentScriptService } from '../content-script.service';

@Component({
  selector: 'app-links-table',
  templateUrl: './links-table.component.html',
  styleUrls: ['./links-table.component.css']
})
export class LinksTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: LinksTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  constructor(private contentScriptService: ContentScriptService) {}

  ngOnInit() {
    this.dataSource = new LinksTableDataSource(this.paginator, this.sort, this.contentScriptService);
  }
}
