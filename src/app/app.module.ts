import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { join } from 'path';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { GlobalExceptionFilter } from 'src/interceptors/exception.interceptor';
import { LoggingMiddleware } from '../middlewares/logging.middleware';
import { CommonModule } from '../common/common.module';
import { typeOrmConfig } from '../config/typeorm.config';
import { CustomerMetaModule } from '../modules/customer/customer.module';
import { BranchMetaModule } from '../modules/branch/branch.module';
import { RegionMetaModule } from '../modules/region/region.module';
import { EmployeeMetaModule } from '../modules/employee/employee.module';
import { GeoTreeMetaModule } from '../modules/geotree/geotree.module';
import { WarehouseMetaModule } from '../modules/warehouse/warehouse.module';
import { SalesItemMetaModule } from '../modules/sales-item/sales-item.module';
import { SalesmanMetaModule } from '../modules/salesman/salesman.module';
import { ProvinceMetaModule } from '../modules/province/province.module';
import { CityMetaModule } from '../modules/city/city.module';
import { DistrictMetaModule } from '../modules/district/district.module';
import { SubDistrictMetaModule } from '../modules/sub-district/sub-district.module';
import { OrganizationMetaModule } from '../modules/organization/organization.module';
import { PositionMetaModule } from '../modules/position/position.module';
import { SupplierMetaModule } from '../modules/supplier/supplier.module';
import { SalesItemConversionModule } from '../modules/sales-item-conversion/sales-item-conversion.module';
import { ArReceiptMethodModule } from '../modules/ar-receipt-method/ar-receipt-method.module';
// import { ReceiptMethodModule } from '../modules/receipt-method/receipt-method.module';
import { SalesActivityModule } from '../modules/sales-activity/sales-activity.module';
import { CoaExpenseModule } from '../modules/coa-expense/coa-expense.module';
import { ApPaymentMethodModule } from '../modules/ap-payment-method/ap-payment-method.module';
import { TransactionTypeModule } from '../modules/transaction-type/transaction-type.module';
import { UserDmsModule } from '../modules/user-dms/user-dms.module';
import { CurrencyModule } from '../modules/currency/currency.module';
import { PriceListModule } from '../modules/price-list/price-list.module';
import { SalesOrderTypesModule } from '../modules/sales-order-types/sales-order-types.module';
import { FpprTypesModule } from '../modules/fppr-types/fppr-types.module';
import { FpprSalesTypesModule } from '../modules/fppr-sales-types/fppr-sales-types.module';
import { ArTermsModule } from '../modules/ar-terms/ar-terms.module';
import { ApTermsModule } from '../modules/ap-terms/ap-terms.module';
import { ApInvoiceTypesModule } from '../modules/ap-invoice-types/ap-invoice-types.module';
import { ZxTaxModule } from '../modules/zx-tax/zx-tax.module';
import { ArOutstandingsModule } from '../modules/ar-outstandings/ar-outstandings.module';
import { SalesOrderStockModule } from '../modules/sales-order-stock/sales-order-stock.module';
import { MtlTrxListsModule } from '../modules/mtl-trx-lists/mtl-trx-lists.module';
import { SummaryFpprModule } from '../modules/summary-fppr/summary-fppr.module';
import { ActualFpprModule } from '../modules/actual-fppr/actual-fppr.module';
import { PurchaseOrderModule } from 'src/modules/purchase-order/purchase-order.module';
import { ItemListMetaModule } from '../modules/item-list/item-list.module';
import { SalesOrderModule } from 'src/modules/sales-order/sales-order.module';
import { AuthModule } from '../modules/auth/auth.module';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    CommonModule,
    CustomerMetaModule,
    BranchMetaModule,
    RegionMetaModule,
    GeoTreeMetaModule,
    EmployeeMetaModule,
    WarehouseMetaModule,
    SalesItemMetaModule,
    SalesmanMetaModule,
    ProvinceMetaModule,
    CityMetaModule,
    DistrictMetaModule,
    SubDistrictMetaModule,
    OrganizationMetaModule,
    PositionMetaModule,
    SupplierMetaModule,
    SalesItemConversionModule,
    ArReceiptMethodModule,
    SalesActivityModule,
    CoaExpenseModule,
    ApPaymentMethodModule,
    TransactionTypeModule,
    UserDmsModule,
    CurrencyModule,
    PriceListModule,
    SalesOrderTypesModule,
    FpprTypesModule,
    FpprSalesTypesModule,
    ArTermsModule,
    ApTermsModule,
    ApInvoiceTypesModule,
    ZxTaxModule,
    ArOutstandingsModule,
    SalesOrderStockModule,
    MtlTrxListsModule,
    SummaryFpprModule,
    ActualFpprModule,
    PurchaseOrderModule,
    ItemListMetaModule,
    SalesOrderModule,
    AuthModule,
    // Other modules can be added here

    PassportModule.register({ defaultStrategy: 'jwt' }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
