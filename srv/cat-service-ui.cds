using MroService from './cat-service';

annotate MroService.VendorList with @UI.LineItem : {$value : [
    {
        $Type             : 'UI.DataField',
        Value             : manufacturerCode,
        ![@UI.Importance] : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : manufacturerCodeDesc,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : localManufacturerCode,
        ![@UI.Importance] : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : localManufacturerCodeDesc,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : country,
        ![@UI.Importance] : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : countryDesc,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : Status,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : initiator,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : approver,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : createdAt,
        ![@UI.Importance] : #Low
    },
    {
        $Type             : 'UI.DataField',
        Value             : createdBy,
        ![@UI.Importance] : #Low
    },
    {
        $Type             : 'UI.DataField',
        Value             : modifiedAt,
        ![@UI.Importance] : #Low
    },
    {
        $Type             : 'UI.DataField',
        Value             : modifiedBy,
        ![@UI.Importance] : #Low
    }
]};

annotate MroService.PricingConditions with @UI.LineItem : {$value : [
    {
        $Type             : 'UI.DataField',
        Value             : ManufacturerCode,
        ![@UI.Importance] : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : manufacturerCodeDesc,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : Country,
        ![@UI.Importance] : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : countryDesc,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : CountryFactor,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : ExchangeRate,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : Status,
        ![@UI.Importance] : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : LocalCurrency,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : ValidityStart,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : ValidityEnd,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : ld_initiator,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : approver,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : approver,
        ![@UI.Importance] : #Medium
    },
    {
        $Type             : 'UI.DataField',
        Value             : createdAt,
        ![@UI.Importance] : #Low
    },
    {
        $Type             : 'UI.DataField',
        Value             : createdBy,
        ![@UI.Importance] : #Low
    },
    {
        $Type             : 'UI.DataField',
        Value             : modifiedAt,
        ![@UI.Importance] : #Low
    },
    {
        $Type             : 'UI.DataField',
        Value             : modifiedBy,
        ![@UI.Importance] : #Low
    }
]};
