import React, { useState } from 'react';
import { Package, Calculator, Ruler, Weight, Shield, Settings, AlertTriangle, CheckCircle, Info, Eye, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { findBestBox, formatBoxSize, getBoxDescription } from './utils/boxCalculator';
import { boxes, packingTypes } from './boxDatabase';
import { BOX_TYPE_CONFIG } from './types';

interface PackageData {
  length: string;
  width: string;
  height: string;
  weight: string;
  packingType: string;
  customBuffer: string;
}

function App() {
  const [packageData, setPackageData] = useState<PackageData>({
    length: '',
    width: '',
    height: '',
    weight: '',
    packingType: 'standard',
    customBuffer: '2'
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showBoxRange, setShowBoxRange] = useState(false);

  const packingTypeOptions = [
    { value: 'basic', label: 'Basic', icon: Package, description: packingTypes.basic.description },
    { value: 'standard', label: 'Standard', icon: Shield, description: packingTypes.standard.description },
    { value: 'fragile', label: 'Fragile', icon: Shield, description: packingTypes.fragile.description },
    { value: 'custom', label: 'Custom', icon: Settings, description: packingTypes.custom.description }
  ];

  const handleInputChange = (field: keyof PackageData, value: string) => {
    setPackageData(prev => ({
      ...prev,
      [field]: value
    }));
    setResult(null);
  };

  const handleCalculate = async () => {
    const length = parseFloat(packageData.length);
    const width = parseFloat(packageData.width);
    const height = parseFloat(packageData.height);
    const weight = packageData.weight ? parseFloat(packageData.weight) : undefined;
    const customBuffer = packageData.customBuffer ? parseFloat(packageData.customBuffer) : undefined;
    
    if (!length || !width || !height) {
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const recommendation = findBestBox({
      length,
      width,
      height,
      weight,
      packingType: packageData.packingType,
      customBuffer
    });
    
    if (recommendation) {
      setResult({
        recommendation,
        itemVolume: (length * width * height).toFixed(2),
        packingType: packingTypeOptions.find(type => type.value === packageData.packingType)?.label
      });
    } else {
      setResult({
        recommendation,
        itemVolume: (length * width * height).toFixed(2),
        packingType: packingTypeOptions.find(type => type.value === packageData.packingType)?.label
      });
    }
    
    setIsCalculating(false);
  };

  const testScenario = () => {
    setPackageData({
      ...packageData,
      length: '27',
      width: '15',
      height: '45',
      packingType: 'standard'
    });
  };

  const isFormValid = packageData.length && packageData.width && packageData.height;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg">
              <Package className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Packing Calculator
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">TUPSS 5374 Keizer, OR - Find the perfect box size for your shipment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 lg:py-12">
        {/* Educational Disclaimer */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-yellow-800">
                <p className="font-semibold mb-1">Educational Tool Only</p>
                <p>
                  This calculator is for educational purposes only and is not endorsed by or affiliated with The UPS Store®. 
                  Always verify box recommendations with official UPS Store guidelines and staff before shipping.
                </p>
                <p className="mt-2">
                  This tool uses the specific box inventory available at Store 5374 (Keizer, OR) based on TUPSS Guidelines - other UPS Store locations may carry different box dimensions that are not considered in this tool.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Input Form */}
          <div className="xl:col-span-1 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-100/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-md sm:rounded-lg">
                <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Package Details</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Length (in)
                  </label>
                  <input
                    type="number"
                    value={packageData.length}
                    onChange={(e) => handleInputChange('length', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-sm sm:text-base"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Width (in)
                  </label>
                  <input
                    type="number"
                    value={packageData.width}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-sm sm:text-base"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Height (in)
                  </label>
                  <input
                    type="number"
                    value={packageData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-sm sm:text-base"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Weight className="w-3 h-3 sm:w-4 sm:h-4" />
                    Weight (lbs) - Optional
                  </div>
                </label>
                <input
                  type="number"
                  value={packageData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Packing Type */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Packing Type
                </label>
                <div className="space-y-2 sm:space-y-3">
                  {/* Custom Buffer Input - Only show for Custom packing type */}
                  {packageData.packingType === 'custom' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Custom Buffer (inches per side)
                      </label>
                      <input
                        type="number"
                        value={packageData.customBuffer}
                        onChange={(e) => handleInputChange('customBuffer', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium"
                        placeholder="2"
                        min="0"
                        step="0.1"
                      />
                      <p className="text-xs text-gray-500 mt-1 sm:mt-1">
                        Buffer added to each side of your item
                      </p>
                    </div>
                  )}
                  {packingTypeOptions.map((type) => {
                    const IconComponent = type.icon;

                    return (
                      <label
                        key={type.value}
                        className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          packageData.packingType === type.value
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/80 hover:shadow-md'
                        }`}
                      >
                        <input
                          type="radio"
                          name="packingType"
                          value={type.value}
                          checked={packageData.packingType === type.value}
                          onChange={(e) => handleInputChange('packingType', e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2 sm:gap-3">
                          <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            packageData.packingType === type.value ? 'text-blue-600' : 'text-gray-500'
                          }`} />
                          <div>
                            <div className={`text-sm sm:text-base font-semibold ${
                              packageData.packingType === type.value ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {type.label}
                            </div>
                            <div className={`text-xs sm:text-sm ${
                              packageData.packingType === type.value ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>


              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={!isFormValid || isCalculating}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation ${
                  isFormValid && !isCalculating
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                    Calculate Box Size
                  </>
                )}
              </button>

              {/* Show Box Range Link */}
              <button
                onClick={() => setShowBoxRange(true)}
                className="w-full py-2 px-4 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2 hover:bg-blue-50 rounded-lg"
              >
                <Eye className="w-4 h-4" />
                Show Box Range
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="xl:col-span-2 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-100/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 mt-4 xl:mt-0">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-md sm:rounded-lg">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recommendation</h2>
            </div>

            {result ? (
              <div className="space-y-4 sm:space-y-6">
                {result.recommendation.error ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      <h3 className="text-sm sm:text-base font-bold text-red-900">
                        {result.recommendation?.error === 'OVERSIZED_ITEM' ? 'Item Too Large for Standard Boxes' : 'Custom Packaging Required'}
                      </h3>
                    </div>
                    
                    {result.recommendation?.error === 'OVERSIZED_ITEM' && result.recommendation?.errorDetails ? (
                      <div className="space-y-3">
                        <div className="bg-white/50 rounded-lg p-4 border border-red-100">
                          <h4 className="font-semibold text-red-900 mb-2">📏 Size Analysis:</h4>
                          <div className="text-red-800 text-sm space-y-1">
                              <p><strong>Your item requires:</strong> {result.recommendation.errorDetails.requiredDimensions}</p>
                              <p><strong>Largest available box footprint:</strong> {result.recommendation.errorDetails.largestAvailableFootprint}</p>
                              <p><strong>Issue:</strong> {result.recommendation.errorDetails.issue}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base text-red-800 font-medium">No standard UPS Store box can accommodate your item's dimensions and weight requirements.</p>
                    )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                      <h4 className="text-sm sm:text-base font-bold text-blue-900 mb-3">💡 Recommended Solutions:</h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="bg-white/50 rounded-md sm:rounded-lg p-3 sm:p-4 border border-blue-100">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                            <div>
                              <h5 className="text-sm sm:text-base font-semibold text-blue-900">Custom Corrugated Box</h5>
                              <p className="text-blue-700 text-xs sm:text-sm mt-1">Have UPS Store build a custom box from corrugated sheets (minimum 275 lb burst test required)</p>
                              <p className="text-blue-600 text-xs mt-1">💰 Cost varies by size • ⏱️ Built on-site</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/50 rounded-md sm:rounded-lg p-3 sm:p-4 border border-blue-100">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                            <div>
                              <h5 className="text-sm sm:text-base font-semibold text-blue-900">UPS Freight Service</h5>
                              <p className="text-blue-700 text-xs sm:text-sm mt-1">For large or heavy items, use UPS Freight instead of small package service</p>
                              <p className="text-blue-600 text-xs mt-1">📦 Handles oversized items • 🚛 Freight pickup/delivery</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/50 rounded-md sm:rounded-lg p-3 sm:p-4 border border-blue-100">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                            <div>
                              <h5 className="text-sm sm:text-base font-semibold text-blue-900">Professional Crating</h5>
                              <p className="text-blue-700 text-xs sm:text-sm mt-1">Wooden crate or pallet for valuable/fragile large items</p>
                              <p className="text-blue-600 text-xs mt-1">🛡️ Maximum protection • 📋 Custom quote required</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/50 rounded-md sm:rounded-lg p-3 sm:p-4 border border-blue-100">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                            <div>
                              <h5 className="text-sm sm:text-base font-semibold text-blue-900">Break Into Multiple Boxes</h5>
                              <p className="text-blue-700 text-xs sm:text-sm mt-1">If possible, separate item into smaller components that fit standard boxes</p>
                              <p className="text-blue-600 text-xs mt-1">💰 Most cost-effective • 📦 Use multiple tracking numbers</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center">
                          <span className="text-sm">📞</span>
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-yellow-900 mb-2">Next Steps</h4>
                          <p className="text-yellow-800 text-sm sm:text-base font-medium mb-2">
                            Visit your local UPS Store to discuss custom packaging options and get accurate pricing.
                          </p>
                          <p className="text-yellow-700 text-xs sm:text-sm">
                            Bring item dimensions, weight, and destination details for the most accurate quote and solution recommendation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Telescoping Box Recommendation */}
                    {result.recommendation.telescopedBox ? (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                          <h3 className="text-sm sm:text-base font-bold text-orange-900">Telescoping Solution Required</h3>
                        </div>
                        <p className="text-orange-800 text-lg sm:text-xl font-bold mb-3">
                          Two identical {formatBoxSize(result.recommendation.telescopedBox.box1)} boxes
                        </p>
                        <div className="bg-white/50 rounded-lg p-3 border border-orange-100 mb-3">
                          <p className="text-orange-700 text-sm sm:text-base font-semibold mb-2">
                            📦 Final Combined Dimensions:
                          </p>
                          <p className="text-orange-900 text-base sm:text-lg font-bold">
                            {result.recommendation.telescopedBox.combinedDimensions}
                          </p>
                          <p className="text-orange-600 text-xs mt-1">
                            ({result.recommendation.telescopedBox.overlap}" overlap for structural integrity)
                          </p>
                        </div>
                        {result.recommendation.telescopedBox.rotated && (
                          <div className="bg-orange-100/50 rounded-lg p-2 border border-orange-200 mb-3">
                            <p className="text-orange-700 text-xs sm:text-sm font-medium">
                              ⚡ Item orientation rotated for optimal fit
                            </p>
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-orange-300/50">
                          <p className="text-orange-700 text-xs sm:text-sm font-semibold mb-1">
                            📦 Enter in UPS CMS System:
                          </p>
                          <p className="text-orange-800 text-base sm:text-lg font-bold">
                            {result.recommendation.telescopedBox.box1.l + 1}" × {result.recommendation.telescopedBox.box1.w + 1}" × {result.recommendation.telescopedBox.combinedHeight + 1}"
                          </p>
                          <p className="text-orange-600 text-xs mt-1">
                            (+1" per dimension to prevent adjustment charges)
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* Single Box Recommendation */}
                    {result.recommendation.box ? (
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                          <h3 className="text-sm sm:text-base font-bold text-emerald-900">Recommended Box</h3>
                        </div>
                        <p className="text-emerald-800 text-lg sm:text-xl font-bold">
                          {formatBoxSize(result.recommendation.box)}
                        </p>
                        <p className="text-emerald-700 text-xs sm:text-sm mt-1 font-medium">
                          {getBoxDescription(result.recommendation.box)}
                        </p>
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-emerald-300/50">
                          <p className="text-emerald-700 text-xs sm:text-sm font-semibold mb-1">
                            📦 Enter in UPS CMS System:
                          </p>
                          <p className="text-emerald-800 text-base sm:text-lg font-bold">
                            {result.recommendation.box.l + 1}" × {result.recommendation.box.w + 1}" × {result.recommendation.box.h + 1}"
                          </p>
                          <p className="text-emerald-600 text-xs mt-1">
                            (+1" per dimension to prevent adjustment charges)
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* Box Specifications */}
                    {(result.recommendation.box || result.recommendation.telescopedBox) && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                        <h4 className="text-sm sm:text-base font-bold text-blue-900 mb-3">Box Specifications</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                          <div>
                            <span className="text-blue-600 font-semibold">Burst Test:</span>
                            <span className="text-blue-800 ml-1 font-bold">{(result.recommendation.box || result.recommendation.telescopedBox?.box1)?.burst} PSI</span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-semibold">Wall Type:</span>
                            <span className="text-blue-800 ml-1 capitalize font-bold">{(result.recommendation.box || result.recommendation.telescopedBox?.box1)?.wall}</span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-semibold">Max Weight:</span>
                            <span className="text-blue-800 ml-1 font-bold">
                              {result.recommendation.telescopedBox 
                                ? `${(result.recommendation.telescopedBox.box1.maxWeight || 0) * 2} lbs (combined)` 
                                : `${result.recommendation.box?.maxWeight || 'N/A'} lbs`}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-semibold">Size Sum:</span>
                            <span className="text-blue-800 ml-1 font-bold">
                              {result.recommendation.telescopedBox 
                                ? `${(result.recommendation.telescopedBox.box1.l + result.recommendation.telescopedBox.box1.w + result.recommendation.telescopedBox.combinedHeight) + 3}" (telescoped)` 
                                : `${result.recommendation.box?.sizeSum || 'N/A'}"`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {result.recommendation.warnings.length > 0 && (
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                          <h4 className="text-sm sm:text-base font-bold text-amber-900">
                            {result.recommendation.telescopedBox ? 'Telescoping Instructions' : 'Important Notes'}
                          </h4>
                        </div>
                        <ul className="text-amber-800 text-xs sm:text-sm space-y-1 font-medium">
                          {result.recommendation.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                          {result.recommendation.telescopedBox && (
                            <>
                              <li>• Cut one box at the seam to create telescoping section</li>
                              <li>• Overlap boxes by {result.recommendation.telescopedBox.overlap}" for structural integrity</li>
                              <li>• Use heavy-duty packing tape on all joints</li>
                            </>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Calculation Details - Educational */}
                    {result.recommendation.calculations && (
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                          <h4 className="text-sm sm:text-base font-bold text-indigo-900">Calculation Details</h4>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="bg-white/50 rounded-lg p-3 border border-indigo-100">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                              <div>
                                <span className="text-indigo-600 font-semibold block">Original Item:</span>
                                <span className="text-indigo-800 font-bold">{result.recommendation.calculations.originalDimensions}</span>
                              </div>
                              <div>
                                <span className="text-indigo-600 font-semibold block">Buffer Applied:</span>
                                <span className="text-indigo-800 font-bold">{result.recommendation.calculations.bufferApplied}</span>
                              </div>
                              <div>
                                <span className="text-indigo-600 font-semibold block">Required Space:</span>
                                <span className="text-indigo-800 font-bold">{result.recommendation.calculations.requiredDimensions}</span>
                              </div>
                            </div>
                          </div>
                          
                          {result.recommendation.calculations.rejectedBoxes && result.recommendation.calculations.rejectedBoxes.length > 0 && (
                            <div className="bg-white/50 rounded-lg p-3 border border-indigo-100">
                              <h5 className="text-xs sm:text-sm font-semibold text-indigo-900 mb-2">
                                📦 Boxes That Were Close But Too Small:
                              </h5>
                              <div className="space-y-1">
                                {result.recommendation.calculations.rejectedBoxes.map((box, index) => (
                                  <div key={index} className="text-xs sm:text-sm text-indigo-700 bg-indigo-50/50 rounded p-2">
                                    <div className="flex flex-col">
                                      <span className="font-bold">{formatBoxSize(box)}</span>
                                      <span className="text-indigo-600 text-xs">
                                        {box.burst} PSI, {box.wall} wall, max {box.maxWeight || 'N/A'} lbs
                                      </span>
                                      <span className="text-red-600 text-xs font-medium">
                                        ⚠️ {box.rejectionReason}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-indigo-600 mt-2 font-medium">
                                💡 These boxes were considered but didn't provide enough space after adding your selected buffer.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Packing Tips */}
                    {!result.recommendation.telescopedBox && (
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">Packing Tips</h4>
                      </div>
                        <ul className="text-slate-700 text-xs sm:text-sm space-y-1 font-medium">
                          <li>• Leave appropriate padding on all sides</li>
                          <li>• Use quality cushioning material</li>
                          <li>• Seal all openings securely</li>
                          {packageData.packingType === 'fragile' && (
                            <li>• Consider double-boxing for extra protection</li>
                          )}
                          <li>• Distribute weight evenly</li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Ready to Calculate</h3>
                <p className="text-gray-600 text-sm sm:text-base font-medium px-4">Enter your package dimensions and click calculate to get box recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Box Range Modal */}
      {showBoxRange && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Available Box Inventory</h3>
                  <p className="text-blue-100 text-sm">TUPSS 5374 - Keizer, OR ({boxes.length} boxes)</p>
                </div>
              </div>
              <button
                onClick={() => setShowBoxRange(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">Dimensions</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">Volume</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">Burst Strength</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">Wall</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">Max Weight</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">Size Sum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boxes
                      .slice()
                      .sort((a, b) => (a.l * a.w * a.h) - (b.l * b.w * b.h))
                      .map((box, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-sm font-semibold text-gray-900">
                          {box.l}" × {box.w}" × {box.h}"
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {(box.l * box.w * box.h).toLocaleString()} in³
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            box.tag === 'regular' 
                              ? 'bg-green-100 text-green-800'
                              : box.tag === 'specialty'
                              ? 'bg-blue-100 text-blue-800'
                              : box.tag === 'wardrobe'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {box.tag === 'regular' && '📦'}
                            {box.tag === 'specialty' && '⚡'}
                            {box.tag === 'wardrobe' && '👔'}
                            {box.tag === 'art' && '🎨'}
                            {' '}
                            {box.tag.charAt(0).toUpperCase() + box.tag.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {box.burst || 'N/A'} {box.burst ? 'PSI' : ''}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700 capitalize">
                          {box.wall || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {box.maxWeight ? `${box.maxWeight} lbs` : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {box.sizeSum ? `${box.sizeSum}"` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Box Type Legend</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                      📦 Regular
                    </span>
                    <span className="text-gray-600">Standard shipping boxes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                      ⚡ Specialty
                    </span>
                    <span className="text-gray-600">Long/odd shapes (golf, guitar, bike)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800 font-medium">
                      👔 Wardrobe
                    </span>
                    <span className="text-gray-600">Large clothing boxes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800 font-medium">
                      🎨 Art
                    </span>
                    <span className="text-gray-600">Flat items, artwork, frames</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium">
                  💡 <strong>Note:</strong> This inventory reflects TUPSS 5374 Keizer, OR location. 
                  Your local store may have additional box sizes or different availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="text-center">
            <p className="text-slate-300 text-xs sm:text-sm mb-2">
              TUPSS Packing Calculator
            </p>
            <p className="text-slate-400 text-xs">
              Copyright 2025 ASRA GO INC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;