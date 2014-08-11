'use strict';

(function() {
    // Goals Controller Spec
    describe('MEAN controllers', function() {
        describe('GoalsController', function() {
            beforeEach(function() {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });
            
            beforeEach(function() {
                module('mean');
                module('mean.system');
                module('mean.goals');
            });

            var GoalsController,
                scope,
                $httpBackend,
                $stateParams,
                $location;

            beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
                scope = $rootScope.$new();

                GoalsController = $controller('GoalsController', {
                    $scope: scope
                });

                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;
            }));

            it('$scope.find() without a query should create an array with at least one goal object ' + 'fetched from XHR', function() {
                console.log('find test');
                $httpBackend.expectGET('goals').respond([{
                    title: 'A Goal',
                    description: 'A Great One'
                }]);

                scope.find();
                $httpBackend.flush();

                expect(scope.goals).toEqualData([{
                    title: 'A Goal',
                    description: 'A Great One'
                }]);
            });

            it('$scope.findOne() should create an array with one article object fetched ' +
                    'from XHR using a articleId URL parameter', function() {
                // fixture URL parament
                $stateParams.goalId = '525a8422f6d0f87f0e407a33';

                // fixture response object
                var testGoalData = function() {
                    return {
                        title: 'An Article about MEAN',
                        content: 'MEAN rocks!'
                    };
                };

                // test expected GET request with response object
                $httpBackend.expectGET(/goals\/([0-9a-fA-F]{24})$/).respond(testGoalData());

                // run controller
                scope.findOne();
                $httpBackend.flush();

                // test scope value
                expect(scope.goal).toEqualData(testGoalData());

            });


            it('$scope.find() with query should create an array with at least one goal object ' + 'fetched from XHR', function() {
                $httpBackend.expectGET(/goals\?(\w+=[A-Za-z0-9]{24})$/).respond([{
                    title: 'A Goal',
                    description: 'A Great One',
                    people: ['53e1a1185ce89b1985e53ca7']
                }, {
                    title: 'A Goal',
                    description: 'A Bad One',
                    people: ['53e1a1185ce89b1985e53de1']
                }, {
                    title: 'A Goal 2',
                    description: 'Another Great One',
                    people: ['53e1a1185ce89b1985e53ca7']
                }
                ]);

                var query = { people: '44e1a1185ce89b1985e53ca7' };

                scope.find(query);
                $httpBackend.flush();

                expect(scope.goals).toEqualData([{
                    title: 'A Goal',
                    description: 'A Great One',
                    people: ['53e1a1185ce89b1985e53ca7']
                }, {
                    title: 'A Goal 2',
                    description: 'Another Great One',
                    people: ['53e1a1185ce89b1985e53ca7']
                }
                ]);
            });

            it('$scope.create() with valid form data should send a POST request ' +
                'with the form input values and then ' +
                'locate to new object URL', function() {

                    // fixture expected POST data
                    var postGoalData = function() {
                        return {
                            title: 'A Goal about MEAN',
                            description: 'MEAN rocks!'
                        };
                    };

                    // fixture expected response data
                    var responseGoalData = function() {
                        return {
                            _id: '525cf20451979dea2c000001',
                            title: 'A Goal about MEAN',
                            description: 'MEAN rocks!'
                        };
                    };

                    // fixture mock form input values
                    scope.title = 'A Goal about MEAN';
                    scope.description = 'MEAN rocks!';

                    // test post request is sent
                    $httpBackend.expectPOST('goals', postGoalData()).respond(responseGoalData());

                    // Run controller
                    scope.create(true);
                    $httpBackend.flush();

                    // test form input(s) are reset
                    expect(scope.title).toEqual('');
                    expect(scope.description).toEqual('');

                    // test URL location to new object
                    expect($location.path()).toBe('/goals/' + responseGoalData()._id);
            });


            it('$scope.update(true) should update a valid article', inject(function(Goals) {

                // fixture rideshare
                var putGoalData = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                title: 'A Goal about MEAN',
                to: 'MEAN is great!'
                    };
                };

                // mock article object from form
                var goal = new Goals(putGoalData());

                // mock article in scope
                scope.goal = goal;

                // test PUT happens correctly
                $httpBackend.expectPUT(/goals\/([0-9a-fA-F]{24})$/).respond();

                // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
                //$httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/, putArticleData()).respond();
                /*
                   Error: Expected PUT /articles\/([0-9a-fA-F]{24})$/ with different data
                   EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!"}
                   GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!","updated":[1383534772975]}
                   */

                // run controller
                scope.update(true);
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/goals/' + putGoalData()._id);

            }));
        });
    });
}());
